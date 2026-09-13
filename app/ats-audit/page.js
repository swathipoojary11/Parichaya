"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PdfDropzone from "@/components/ats/PdfDropzone";
import AtsReportView from "@/components/ats/AtsReportView";
import { runAtsAudit } from "@/lib/services/atsAuditService";

export default function AtsAuditPage() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [roleTitle, setRoleTitle] = useState("Full Stack Engineer");
  const [auditing, setAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState(null);
  const [unlockedQuests, setUnlockedQuests] = useState([]);
  const [error, setError] = useState(null);

  const handleAuditSubmit = async (e) => {
    e.preventDefault();

    if (!resumeText || resumeText.length < 30) {
      setError("Please upload a valid PDF resume with extractable text.");
      return;
    }

    if (!jdText || jdText.length < 30) {
      setError("Please paste the target Job Description text.");
      return;
    }

    setError(null);
    setAuditing(true);

    try {
      const result = await runAtsAudit(resumeText, jdText, roleTitle);
      setAuditReport(result.auditResult);
      setUnlockedQuests(result.unlockedQuests);
    } catch (err) {
      console.error("ATS Audit Failed:", err);
      setError("ATS audit processing failed. Local AI may be busy.");
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-mono border border-orange-500/20">
          <span>● ATS Match & Gap Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight">
          Existing Resume <span className="text-orange-500">ATS Audit</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl">
          Upload your existing PDF resume and paste a target Job Description. Qwen2.5 3B will calculate your ATS compatibility score, identify missing skills, and rewrite your bullets.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-mono">
          {error}
        </div>
      )}

      {/* Main Content Area */}
      {!auditReport ? (
        <Card glow className="max-w-4xl mx-auto">
          <form onSubmit={handleAuditSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: PDF Resume Dropzone */}
              <div className="space-y-4">
                <PdfDropzone onParsedText={(text) => setResumeText(text)} />
                {resumeText && (
                  <div className="p-3 bg-zinc-950 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 font-mono flex items-center space-x-2">
                    <span>✓ Parsed {resumeText.length} characters of resume text</span>
                  </div>
                )}
              </div>

              {/* Right Column: Target Job Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Target Job Title *</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Full Stack Engineer"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Target Job Description (JD) *</label>
                  <textarea
                    rows={8}
                    required
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the full job posting / requirements here..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500 leading-relaxed font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <Button type="submit" variant="primary" loading={auditing} size="lg">
                Run ATS Gap Audit 🚀
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <AtsReportView
          report={auditReport}
          unlockedQuests={unlockedQuests}
          onReset={() => setAuditReport(null)}
        />
      )}
    </div>
  );
}
