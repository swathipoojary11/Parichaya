"use client";

import Button from "@/components/ui/Button";

export default function ResumePreview({ resume, onReset }) {
  if (!resume) return null;

  const { contact, summary, education, experience, projects, skills } = resume;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Action Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-4 shadow-soft">
        <div>
          <span className="text-xs font-mono text-emerald-600 uppercase font-bold tracking-wider">
            ✓ Synthesized ATS Resume Ready
          </span>
          <h2 className="text-lg font-bold text-slate-900">{contact?.fullName}&apos;s Resume</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm" onClick={onReset}>
            Edit Answers
          </Button>
          <Button variant="indigo" size="sm" onClick={handlePrint}>
            Print / Save PDF 🖨️
          </Button>
        </div>
      </div>

      {/* Structured Resume Canvas Paper Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 space-y-6 text-slate-800 shadow-panel printable-resume">
        {/* Contact Header */}
        <div className="border-b border-slate-200 pb-4 text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">{contact?.fullName}</h1>
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-600 font-mono">
            {contact?.email && <span>{contact.email}</span>}
            {contact?.phone && <span>&bull; {contact.phone}</span>}
            {contact?.linkedin && <span>&bull; {contact.linkedin}</span>}
            {contact?.github && <span>&bull; {contact.github}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
              Professional Summary
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
              Education
            </h3>
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start text-sm">
                <div>
                  <span className="font-bold text-slate-900">{edu.institution}</span>
                  <p className="text-xs text-slate-600">{edu.degree}</p>
                </div>
                <div className="text-right text-xs font-mono text-slate-600">
                  <span>{edu.gradYear}</span>
                  {edu.gpa && <p className="text-indigo-600 font-bold">GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
              Work Experience
            </h3>
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">{exp.company} &mdash; <span className="text-indigo-600 font-semibold">{exp.role}</span></span>
                  <span className="text-xs font-mono text-slate-500">{exp.duration}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                  {exp.bullets?.map((b, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
              Projects & Engineering Work
            </h3>
            {projects.map((proj, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">{proj.title}</span>
                  {proj.techStack && (
                    <span className="text-xs font-mono text-slate-500">
                      [{proj.techStack.join(", ")}]
                    </span>
                  )}
                </div>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                  {proj.bullets?.map((b, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
              Technical Core Competencies
            </h3>
            <div className="grid grid-cols-1 gap-1 text-xs text-slate-700">
              {skills.languages?.length > 0 && (
                <div><span className="font-bold text-slate-900">Languages:</span> {skills.languages.join(", ")}</div>
              )}
              {skills.frameworks?.length > 0 && (
                <div><span className="font-bold text-slate-900">Frameworks / Libraries:</span> {skills.frameworks.join(", ")}</div>
              )}
              {skills.tools?.length > 0 && (
                <div><span className="font-bold text-slate-900">Developer Tools:</span> {skills.tools.join(", ")}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
