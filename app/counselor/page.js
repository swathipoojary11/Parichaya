"use client";

import { useState } from "react";
import IntakeWizard from "@/components/counselor/IntakeWizard";
import ResumePreview from "@/components/counselor/ResumePreview";
import ChatFeedbackPanel from "@/components/feedback/ChatFeedbackPanel";
import { synthesizeAndSaveResume } from "@/lib/services/counselorService";

export default function CounselorPage() {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);

  const handleIntakeSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await synthesizeAndSaveResume(formData);
      setResumeData(result.structuredResume);
    } catch (err) {
      console.error("Resume synthesis failed:", err);
      setError("Failed to synthesize resume. Local AI may be busy or offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-full">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-mono font-bold border border-orange-200">
          <span>● AI Counselor Guided Intake</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Guided Resume <span className="text-orange-500">Counselor</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Answer 4 quick guided steps to let local Qwen2.5 3B synthesize your project experience into Google X-Y-Z formula bullet points and generate an ATS-ready resume.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-mono font-medium shadow-xs">
          {error}
        </div>
      )}

      {/* Responsive Multi-Panel Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Intake / Preview Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {!resumeData ? (
            <IntakeWizard onSubmit={handleIntakeSubmit} loading={loading} />
          ) : (
            <ResumePreview resume={resumeData} onReset={() => setResumeData(null)} />
          )}
        </div>

        {/* AI Chat Assistant Panel (4 Cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20">
          <ChatFeedbackPanel
            contextTitle="Counselor AI Coach"
            contextData={{ resumeData, step: resumeData ? "Resume Synthesized" : "Intake Phase" }}
          />
        </div>
      </div>
    </div>
  );
}
