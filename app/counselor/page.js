"use client";

import { useState } from "react";
import IntakeWizard from "@/components/counselor/IntakeWizard";
import ResumePreview from "@/components/counselor/ResumePreview";
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
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-mono border border-orange-500/20">
          <span>● AI Counselor Mode</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight">
          Guided Resume <span className="text-orange-500">Counselor</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl">
          Don&apos;t have a resume? Answer 4 quick guided steps. Qwen2.5 3B will synthesize your background into an ATS-formatted resume with Google X-Y-Z impact bullets.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-mono">
          {error}
        </div>
      )}

      {/* Main Flow Render */}
      {!resumeData ? (
        <IntakeWizard onSubmit={handleIntakeSubmit} loading={loading} />
      ) : (
        <ResumePreview resume={resumeData} onReset={() => setResumeData(null)} />
      )}
    </div>
  );
}
