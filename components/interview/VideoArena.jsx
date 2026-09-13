"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoArena({ isRecording, activeQuestion }) {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);

  useEffect(() => {
    async function setupMediaDevices() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setMicActive(true);
      } catch (err) {
        console.warn("Camera/Mic access denied or unavailable in dev environment:", err);
        setCameraActive(false);
        setMicActive(false);
      }
    }

    setupMediaDevices();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-panel aspect-video max-w-4xl mx-auto flex items-center justify-center">
      {/* Candidate Video Stream */}
      {cameraActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        /* Fallback Candidate Avatar */
        <div className="flex flex-col items-center justify-center space-y-3 text-slate-400">
          <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl font-bold">
            👤
          </div>
          <p className="text-xs font-mono">Camera Feed Preview (Virtual Video Arena)</p>
        </div>
      )}

      {/* AI Interviewer Picture-in-Picture Box */}
      <div className="absolute top-4 right-4 w-44 h-32 bg-white/90 backdrop-blur-md border border-indigo-200 rounded-2xl p-3 flex flex-col items-center justify-center text-center space-y-1 shadow-lg">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md animate-pulse">
          AI
        </div>
        <span className="text-xs font-bold text-slate-900">Qwen2.5 3B</span>
        <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">Interviewer Active</span>
      </div>

      {/* Live Recording & Mic Status Badges */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-3 text-xs font-mono">
        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center space-x-2 shadow-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`} />
          <span className="text-slate-800 font-bold">{isRecording ? "LIVE REC" : "READY"}</span>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 font-bold shadow-xs">
          🎤 Mic: {micActive ? <span className="text-emerald-600">ON</span> : <span className="text-slate-400">OFF</span>}
        </div>
      </div>
    </div>
  );
}
