"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PdfDropzone from "@/components/ats/PdfDropzone";
import AtsReportView from "@/components/ats/AtsReportView";
import ChatFeedbackPanel from "@/components/feedback/ChatFeedbackPanel";
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
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200">
          <span>● ATS Gap & Skill Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Existing Resume <span className="text-indigo-600">ATS Audit</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Upload your PDF resume and target Job Description. Local Qwen2.5 3B will calculate your ATS match score, extract missing skill gaps, and rewrite your bullet points.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-mono font-medium shadow-xs">
          {error}
        </div>
      )}

      {/* Multi-Panel Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Audit Workspace (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {!auditReport ? (
            <Card glow className="border border-slate-200/90 shadow-soft">
              <form onSubmit={handleAuditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PDF Resume Dropzone */}
                  <div className="space-y-4">
                    <PdfDropzone onParsedText={(text) => setResumeText(text)} />
                    {resumeText && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-mono font-semibold flex items-center space-x-2">
                        <span>✓ Parsed {resumeText.length} characters of resume text</span>
                      </div>
                    )}
                  </div>

                  {/* Target Job Description */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Title *</label>
                      <input
                        type="text"
                        required
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        placeholder="e.g. Full Stack Engineer"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Description (JD) *</label>
                      <textarea
                        rows={8}
                        required
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        placeholder="Paste the full job posting / requirements here..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button type="submit" variant="indigo" loading={auditing} size="lg">
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

        {/* AI Chat Feedback Assistant (4 Cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <ChatFeedbackPanel
            contextTitle="ATS Audit AI Assistant"
            contextData={{ auditReport, roleTitle }}
          />
        </div>
      </div>
    </div>
  );
}
