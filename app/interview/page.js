"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import VideoArena from "@/components/interview/VideoArena";
import LiveHudTelemetry from "@/components/interview/LiveHudTelemetry";
import ChatFeedbackPanel from "@/components/feedback/ChatFeedbackPanel";
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

  useEffect(() => {
    async function initSession() {
      const newSession = await createInterviewSession("Full Stack Engineer", "technical");
      setSession(newSession.sessionRecord);

      if (typeof window !== "undefined") {
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
    }

    initSession();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

        if (wsRef.current && wsRef.current.readyState === 1) {
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

    if (wsRef.current && wsRef.current.readyState === 1) {
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
    await saveSessionTranscript(
      session?.sessionId || Date.now(),
      transcriptLog,
      telemetry,
      sessionSeconds
    );

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
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200">
            <span>● Video &amp; Voice Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mock Interview <span className="text-indigo-600">Arena</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-bold">
            Session Time: <span className="text-indigo-600 font-bold">{Math.floor(sessionSeconds / 60)}m {sessionSeconds % 60}s</span>
          </div>

          <div className="text-xs font-mono px-3 py-1.5 rounded-xl border border-slate-200 bg-white flex items-center space-x-1.5 font-bold">
            <span className={`w-2.5 h-2.5 rounded-full ${wsConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-slate-700">WS: {wsConnected ? "127.0.0.1:3001" : "Offline"}</span>
          </div>
        </div>
      </div>

      {/* Multi-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Video Arena & Telemetry Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <VideoArena isRecording={isRecording} activeQuestion={activeQuestion} />

          <LiveHudTelemetry
            telemetry={telemetry}
            activeQuestion={activeQuestion}
            currentTranscript={currentTranscript}
          />

          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft">
            {!isRecording ? (
              <Button variant="indigo" size="lg" onClick={startRecording}>
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
              <Button variant="orange" onClick={handleFinishSession}>
                Submit &amp; View STAR Feedback 🏆
              </Button>
            </div>
          </div>
        </div>

        {/* AI Chat Assistant (4 Cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <ChatFeedbackPanel
            contextTitle="Video Arena Coach"
            contextData={{ activeQuestion, telemetry }}
          />
        </div>
      </div>
    </div>
  );
}
