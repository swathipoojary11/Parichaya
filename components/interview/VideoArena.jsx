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
    <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl aspect-video max-w-4xl mx-auto flex items-center justify-center">
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
        <div className="flex flex-col items-center justify-center space-y-3 text-zinc-500">
          <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl font-bold">
            👤
          </div>
          <p className="text-xs font-mono">Camera Feed Preview (Virtual Sandbox)</p>
        </div>
      )}

      {/* AI Interviewer Picture-in-Picture Box */}
      <div className="absolute top-4 right-4 w-40 h-28 bg-zinc-900/90 backdrop-blur border border-orange-500/30 rounded-xl p-2 flex flex-col items-center justify-center text-center space-y-1 shadow-lg">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-orange-500/20 animate-pulse">
          AI
        </div>
        <span className="text-[11px] font-bold text-zinc-200">Qwen2.5 3B</span>
        <span className="text-[9px] font-mono text-orange-400 uppercase">Interviewer Active</span>
      </div>

      {/* Live Recording & Mic Status Badges */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-3 text-xs font-mono">
        <div className="px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-800 flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-zinc-500'}`} />
          <span className="text-zinc-200 font-semibold">{isRecording ? "LIVE REC" : "READY"}</span>
        </div>

        <div className="px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-800 text-zinc-300">
          🎤 Mic: {micActive ? <span className="text-emerald-400">ON</span> : <span className="text-zinc-500">OFF</span>}
        </div>
      </div>
    </div>
  );
}
