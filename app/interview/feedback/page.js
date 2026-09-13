"use client";

import { useEffect, useState } from "react";
import FeedbackReportView from "@/components/interview/FeedbackReportView";
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
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
          <h3 className="text-lg font-bold text-zinc-100 font-mono">Qwen2.5 3B Evaluating Response STAR Structure...</h3>
          <p className="text-xs text-zinc-400">Analyzing technical depth, speech cadence, and filler-word frequencies...</p>
        </div>
      ) : (
        <FeedbackReportView
          feedback={feedback}
          telemetry={telemetry}
          onNewSession={() => router.push("/interview")}
        />
      )}
    </div>
  );
}
