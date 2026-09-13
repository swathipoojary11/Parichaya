"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function IntakeWizard({ onSubmit, loading }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    targetRole: "Full Stack Engineer",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    college: "",
    degree: "B.E. Computer Science",
    gradYear: "2026",
    gpa: "8.8 CGPA",
    projectsRaw: "",
    experienceRaw: "",
    skillsRaw: ""
  });

  const updateField = (field, value) => {
    setError("");
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!formData.email.trim()) {
        setError("Please enter your email address.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.college.trim()) {
        setError("Please enter your college name.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.projectsRaw.trim()) {
        setError("Please enter a brief description of your projects.");
        return;
      }
    }

    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.skillsRaw.trim()) {
      setError("Please list your technical skills.");
      return;
    }
    if (onSubmit) onSubmit(formData);
  };

  return (
    <Card glow className="max-w-3xl mx-auto border border-slate-200/90 shadow-soft">
      {/* Wizard Step Progress Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span className="font-bold">Step {step} of 4</span>
          <span className="text-orange-600 font-bold">
            {step === 1 && "Personal Info & Role"}
            {step === 2 && "Education & Academics"}
            {step === 3 && "Projects & Accomplishments"}
            {step === 4 && "Skills & Industry Experience"}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold rounded-xl mb-4">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Personal Details & Target Career Goal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Swathi Poojary"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Role *</label>
                <select
                  value={formData.targetRole}
                  onChange={(e) => updateField("targetRole", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="candidate@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  placeholder="linkedin.com/in/swathi"
                  value={formData.linkedin}
                  onChange={(e) => updateField("linkedin", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Profile URL</label>
                <input
                  type="text"
                  placeholder="github.com/swathi"
                  value={formData.github}
                  onChange={(e) => updateField("github", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Academic Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">College / University Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sahyadri College of Engineering & Management"
                  value={formData.college}
                  onChange={(e) => updateField("college", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Degree / Specialization</label>
                <input
                  type="text"
                  placeholder="B.E. Computer Science"
                  value={formData.degree}
                  onChange={(e) => updateField("degree", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="text"
                  placeholder="2026"
                  value={formData.gradYear}
                  onChange={(e) => updateField("gradYear", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GPA / CGPA</label>
                <input
                  type="text"
                  placeholder="8.8 CGPA"
                  value={formData.gpa}
                  onChange={(e) => updateField("gpa", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Projects */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Projects & Technical Accomplishments</h3>
            <p className="text-xs text-slate-500">Describe your academic projects or side builds. Qwen2.5 3B local AI will automatically format these into high-impact Google X-Y-Z formula bullet points.</p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Projects Description *</label>
              <textarea
                rows={5}
                placeholder="e.g. Created PARICHAYA, an AI placement engine with React, Next.js, and local Ollama. Built automated ATS scoring and interactive video mock interview modules."
                value={formData.projectsRaw}
                onChange={(e) => updateField("projectsRaw", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Step 4: Skills & Experience */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Skills & Work Experience</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Technical Skills (Comma Separated) *</label>
              <input
                type="text"
                placeholder="JavaScript, React, Node.js, Python, Tailwind CSS, IndexedDB, Git"
                value={formData.skillsRaw}
                onChange={(e) => updateField("skillsRaw", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Internship / Work Experience (Optional)</label>
              <textarea
                rows={4}
                placeholder="e.g. Frontend Intern at Tech Corp. Developed reusable React components, improved accessibility scores, and integrated REST API endpoints."
                value={formData.experienceRaw}
                onChange={(e) => updateField("experienceRaw", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <Button type="button" variant="secondary" onClick={handleBack}>
              ← Back
            </Button>
          ) : <div />}

          {step < 4 ? (
            <Button type="button" variant="primary" onClick={handleNext}>
              Next Step →
            </Button>
          ) : (
            <Button type="button" variant="primary" loading={loading} onClick={handleSubmit}>
              Synthesize ATS Resume ✨
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
