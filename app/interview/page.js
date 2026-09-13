"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import VideoArena from "@/components/interview/VideoArena";
import LiveHudTelemetry from "@/components/interview/LiveHudTelemetry";
import { createInterviewSession, saveSessionTranscript } from "@/lib/services/interviewService";
import { useRouter } from "next/navigation";

export default function InterviewPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [transcriptLog, setTranscriptLog] = useState([]);
  const [telemetry, setTelemetry] = useState({ wpm: 140, totalWords: 0, totalFillers: 0, fillerWordCounts: {} });
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);

  const wsRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize Session & Connect to WebSocket Telemetry Server
  useEffect(() => {
    async function initSession() {
      const newSession = await createInterviewSession("Full Stack Engineer", "technical");
      setSession(newSession.sessionRecord);

      // Connect to local WebSocket IPC telemetry server on port 3001
      try {
        const ws = new WebSocket("ws://127.0.0.1:3001");

        ws.onopen = () => {
          setWsConnected(true);
          console.log("[AURA Client] Connected to ws://127.0.0.1:3001");
        };

        ws.onmessage = (evt) => {
          try {
            const data = JSON.parse(evt.data);
            if (data.type === "telemetry_update") {
              setTelemetry({
                wpm: data.wpm,
                totalWords: data.totalWords,
                totalFillers: data.totalFillers,
                fillerWordCounts: data.fillerWordCounts
              });
            }
          } catch (e) {
            console.error(e);
          }
        };

        ws.onerror = () => setWsConnected(false);
        ws.onclose = () => setWsConnected(false);

        wsRef.current = ws;
      } catch (err) {
        console.warn("WebSocket telemetry server offline:", err);
      }
    }

    initSession();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Web Speech API Speech-to-Text setup
  const startRecording = () => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setCurrentTranscript(text);

        // Stream transcript chunk to WebSocket server
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "transcript_chunk", text }));
        }
      };

      recognition.onerror = (e) => console.warn("Speech recognition error:", e);
      recognition.start();
      recognitionRef.current = recognition;
    }

    setIsRecording(true);
    timerRef.current = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const handleNextQuestion = () => {
    if (!session || !session.questions) return;

    // Save answer to transcript log
    const activeQ = session.questions[currentQuestionIdx];
    const logItem = {
      speaker: "candidate",
      questionId: activeQ.id,
      text: currentTranscript || "Candidate completed verbal answer.",
      wpm: telemetry.wpm,
      fillerCount: telemetry.totalFillers
    };

    setTranscriptLog(prev => [...prev, logItem]);
    setCurrentTranscript("");

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "reset" }));
    }

    if (currentQuestionIdx < session.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      handleFinishSession();
    }
  };

  const handleFinishSession = async () => {
    stopRecording();
    const finalSession = await saveSessionTranscript(
      session.sessionId || Date.now(),
      transcriptLog,
      telemetry,
      sessionSeconds
    );

    // Save active session feedback state in localStorage for feedback page view
    if (typeof window !== "undefined") {
      localStorage.setItem("latest_session_transcript", JSON.stringify(transcriptLog));
      localStorage.setItem("latest_session_telemetry", JSON.stringify(telemetry));
    }

    router.push("/interview/feedback");
  };

  const activeQuestion = session?.questions?.[currentQuestionIdx];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-mono border border-orange-500/20">
            <span>● Video / Voice Arena</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight">
            Mock Interview <span className="text-orange-500">Arena</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
            Session Time: <span className="text-orange-400 font-bold">{Math.floor(sessionSeconds / 60)}m {sessionSeconds % 60}s</span>
          </div>

          <div className="text-xs font-mono px-3 py-1.5 rounded-lg border flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-zinc-300">WS: {wsConnected ? "127.0.0.1:3001" : "Disconnected"}</span>
          </div>
        </div>
      </div>

      {/* Main Video Arena Canvas */}
      <VideoArena isRecording={isRecording} activeQuestion={activeQuestion} />

      {/* Live Telemetry HUD Overlay */}
      <LiveHudTelemetry
        telemetry={telemetry}
        activeQuestion={activeQuestion}
        currentTranscript={currentTranscript}
      />

      {/* Controls Bar */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-4xl mx-auto">
        {!isRecording ? (
          <Button variant="primary" size="lg" onClick={startRecording}>
            ▶ Start Voice Session
          </Button>
        ) : (
          <Button variant="secondary" size="lg" onClick={stopRecording}>
            ⏸ Pause Speech
          </Button>
        )}

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleNextQuestion} disabled={!isRecording && !currentTranscript}>
            Next Question →
          </Button>
          <Button variant="primary" onClick={handleFinishSession}>
            Submit &amp; View STAR Feedback 🏆
          </Button>
        </div>
      </div>
    </div>
  );
}
