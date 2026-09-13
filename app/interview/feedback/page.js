"use client";

import { useEffect, useState } from "react";
import FeedbackReportView from "@/components/interview/FeedbackReportView";
import ChatFeedbackPanel from "@/components/feedback/ChatFeedbackPanel";
import { evaluateSession } from "@/lib/services/feedbackService";
import { useRouter } from "next/navigation";

export default function InterviewFeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateReport() {
      let transcriptLog = [];
      let telemetryLog = { wpm: 142, totalFillers: 4 };

      if (typeof window !== "undefined") {
        try {
          const rawTranscript = localStorage.getItem("latest_session_transcript");
          const rawTelemetry = localStorage.getItem("latest_session_telemetry");
          if (rawTranscript) transcriptLog = JSON.parse(rawTranscript);
          if (rawTelemetry) telemetryLog = JSON.parse(rawTelemetry);
        } catch (e) {
          console.warn("Storage load fallback:", e);
        }
      }

      setTelemetry(telemetryLog);

      const result = await evaluateSession(Date.now(), transcriptLog, telemetryLog);
      setFeedback(result);
      setLoading(false);
    }

    generateReport();
  }, []);

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center bg-white border border-slate-200 rounded-3xl shadow-soft">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <h3 className="text-lg font-bold text-slate-900 font-mono">Qwen2.5 3B Evaluating STAR Structure...</h3>
          <p className="text-xs text-slate-500">Analyzing technical depth, speech cadence, and filler-word frequencies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Feedback Report (8 Cols) */}
          <div className="lg:col-span-8">
            <FeedbackReportView
              feedback={feedback}
              telemetry={telemetry}
              onNewSession={() => router.push("/interview")}
            />
          </div>

          {/* AI Chat Assistant (4 Cols) */}
          <div className="lg:col-span-4 sticky top-20">
            <ChatFeedbackPanel
              contextTitle="Interview Feedback Coach"
              contextData={{ feedback, telemetry }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
