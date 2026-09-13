"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function IntakeWizard({ onSubmit, loading }) {
  const [step, setStep] = useState(1);
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
    gpa: "3.8/4.0",
    projectsRaw: "",
    experienceRaw: "",
    skillsRaw: ""
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <Card glow className="max-w-2xl mx-auto">
      {/* Wizard Step Progress Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>Step {step} of 4</span>
          <span className="text-orange-400 font-bold">
            {step === 1 && "Personal Info"}
            {step === 2 && "Education"}
            {step === 3 && "Projects"}
            {step === 4 && "Skills & Experience"}
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-zinc-50">Personal Details & Career Goal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Target Role *</label>
                <select
                  value={formData.targetRole}
                  onChange={(e) => updateField("targetRole", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                >
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1-555-0199"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  placeholder="linkedin.com/in/alex"
                  value={formData.linkedin}
                  onChange={(e) => updateField("linkedin", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">GitHub Profile URL</label>
                <input
                  type="text"
                  placeholder="github.com/alex"
                  value={formData.github}
                  onChange={(e) => updateField("github", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-zinc-50">Academic Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">College / University Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sahyadri College of Engineering"
                  value={formData.college}
                  onChange={(e) => updateField("college", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Degree / Specialization</label>
                <input
                  type="text"
                  placeholder="B.E. Computer Science"
                  value={formData.degree}
                  onChange={(e) => updateField("degree", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Graduation Year</label>
                <input
                  type="text"
                  placeholder="2026"
                  value={formData.gradYear}
                  onChange={(e) => updateField("gradYear", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">GPA / Score</label>
                <input
                  type="text"
                  placeholder="3.8 / 4.0 or 8.5 CGPA"
                  value={formData.gpa}
                  onChange={(e) => updateField("gpa", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Projects */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-zinc-50">Projects & Key Work</h3>
            <p className="text-xs text-zinc-400">Describe projects you built during coursework or independently. Qwen2.5 3B will rewrite these using the Google X-Y-Z formula.</p>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Projects Description *</label>
              <textarea
                rows={5}
                required
                placeholder="e.g. Built an e-commerce platform using React, Node.js, and MongoDB. Handled user auth, payment integration, and reduced cart load times by 40%."
                value={formData.projectsRaw}
                onChange={(e) => updateField("projectsRaw", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Step 4: Skills & Experience */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-zinc-50">Skills & Work / Internship Experience</h3>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Technical Skills (Comma Separated) *</label>
              <input
                type="text"
                required
                placeholder="JavaScript, Python, React, Node.js, SQL, Git, Tailwind CSS"
                value={formData.skillsRaw}
                onChange={(e) => updateField("skillsRaw", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Internship / Work Experience (Optional)</label>
              <textarea
                rows={4}
                placeholder="e.g. Web Development Intern at XYZ Company for 3 months. Fixed UI bugs, improved page speed, and built REST APIs."
                value={formData.experienceRaw}
                onChange={(e) => updateField("experienceRaw", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
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
            <Button type="submit" variant="primary" loading={loading}>
              Generate ATS Resume ✨
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
