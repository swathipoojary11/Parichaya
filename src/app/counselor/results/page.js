'use client';
import { useEffect, useState, useRef } from 'react';
import AppShell from '@/components/AppShell';
import { useRouter } from 'next/navigation';

export default function CounselorResultsPage() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    try {
      const dataStr = localStorage.getItem('parichaya_extracted_resume');
      if (dataStr) {
        setResumeData(JSON.parse(dataStr));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const downloadPdf = async () => {
    if (!resumeData || !pdfRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = pdfRef.current;
      const nameStr = (resumeData.name || 'Candidate').replace(/\s+/g, '_');

      const opt = {
        margin:       [0.3, 0.4, 0.4, 0.4],
        filename:     `${nameStr}_Resume.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF Generation error:', err);
      alert('Generating PDF... If standard download fails, use Print -> Save as PDF.');
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!resumeData) {
    return (
      <AppShell>
        <div className="p-8 max-w-4xl mx-auto text-center font-['Inter'] flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-2xl font-black font-['Outfit'] uppercase mb-2">No Resume Profile Data Found</h1>
          <p className="text-gray-500 mb-6">Please complete the AI Counselor interview process first.</p>
          <button onClick={() => router.push('/counselor/interview')} className="btn-primary">
            Start Career Interview
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto animate-fade-in font-['Inter']">
        
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b-[4px] border-black pb-6">
          <div>
            <p className="badge badge-teal mb-2 font-bold uppercase tracking-widest text-[10px]">Final Step</p>
            <h1 className="text-3xl md:text-5xl font-black font-['Outfit'] uppercase tracking-tight">
              Generated Resume Profile
            </h1>
            <p className="text-sm md:text-base font-semibold mt-1 text-gray-700">
              Formatted according to standard industry structure. Click below to download as PDF.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={downloadPdf} 
              disabled={isGeneratingPdf}
              className="h-14 px-8 rounded-2xl border-[3px] border-black bg-[#FF7A18] text-white font-black uppercase tracking-wider shadow-[4px_4px_0px_#111] hover:translate-y-1 hover:shadow-[2px_2px_0px_#111] transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <span>{isGeneratingPdf ? '⏳ Exporting...' : '📄 Download PDF Resume'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Action Hub & Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl border-[4px] border-black bg-white shadow-[6px_6px_0px_#111]">
              <h2 className="text-xl font-black font-['Outfit'] uppercase mb-3 text-[#2EC4B6]">Next Career Steps</h2>
              <p className="font-medium text-xs text-gray-600 mb-4">
                Your resume is ready in standard PDF format. Continue by auditing your resume score against 15+ target job roles or practice targeted skill missions.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/ats')}
                  className="w-full text-left p-3.5 rounded-xl border-[2px] border-black hover:bg-[#FF7A18]/10 transition-colors font-bold text-xs flex justify-between items-center"
                >
                  <span>1. Test Resume in ATS Auditor</span>
                  <span>→</span>
                </button>
                <button 
                  onClick={() => router.push('/arena')}
                  className="w-full text-left p-3.5 rounded-xl border-[2px] border-black hover:bg-[#2EC4B6]/10 transition-colors font-bold text-xs flex justify-between items-center"
                >
                  <span>2. Practice Skill Arenas</span>
                  <span>→</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl border-[4px] border-black bg-amber-100 shadow-[6px_6px_0px_#111]">
              <h2 className="text-lg font-black font-['Outfit'] uppercase mb-2 text-black flex items-center gap-2">
                <span>📌</span> Note
              </h2>
              <p className="font-semibold text-xs text-gray-800 leading-relaxed">
                The resume output is generated exclusively in <strong>PDF format</strong> to preserve formatting when applying to top tech roles.
              </p>
            </div>
          </div>

          {/* Resume PDF Preview Frame */}
          <div className="lg:col-span-8 border-[4px] border-black shadow-[8px_8px_0px_#111] rounded-2xl overflow-hidden bg-gray-200 p-4 md:p-8">
            <div className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              PDF Print Layout Preview
            </div>

            {/* Target Element for PDF Render matching uploaded PDF format */}
            <div className="bg-white mx-auto shadow-md border border-gray-300 max-w-[800px] min-h-[1000px] overflow-hidden">
              <div 
                ref={pdfRef} 
                id="resume-print-area"
                className="p-8 text-black font-serif text-[11px] leading-snug bg-white h-full"
              >
                {/* Header */}
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wide text-black mb-1 font-serif">
                  {resumeData.name || 'CANDIDATE NAME'}
                </h1>
                <div className="text-[10px] text-gray-800 flex flex-wrap justify-center items-center gap-1.5 font-sans">
                  {resumeData.location && <span>{resumeData.location}</span>}
                  {resumeData.location && (resumeData.email || resumeData.linkedin || resumeData.github) && <span>•</span>}
                  {resumeData.email && <span>{resumeData.email}</span>}
                  {resumeData.email && (resumeData.linkedin || resumeData.github) && <span>•</span>}
                  {resumeData.linkedin && <span>{resumeData.linkedin}</span>}
                  {resumeData.linkedin && resumeData.github && <span>•</span>}
                  {resumeData.github && <span>{resumeData.github}</span>}
                </div>
              </div>

              {/* Professional Summary */}
              {resumeData.summary && (
                <div className="mb-4">
                  <div className="text-[12px] font-bold text-black font-sans border-b border-black pb-0.5 mb-1.5">
                    Professional Summary
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-justify text-gray-900">
                    {resumeData.summary}
                  </p>
                </div>
              )}

              {/* Education */}
              {resumeData.education && resumeData.education.length > 0 && (
                <div className="mb-4">
                  <div className="text-[12px] font-bold text-black font-sans border-b border-black pb-0.5 mb-1.5">
                    Education
                  </div>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="flex justify-between items-baseline text-[11px]">
                        <span className="font-bold text-black">{edu.institution || edu.school}</span>
                        <span className="font-bold text-black text-[10px]">{edu.expectedDate || edu.year}</span>
                      </div>
                      <div className="italic text-[10.5px] text-gray-800 mb-1">{edu.degree}</div>
                      {edu.details && Array.isArray(edu.details) && (
                        <ul className="list-disc list-inside text-[10px] text-gray-800 space-y-0.5 pl-1">
                          {edu.details.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Experience */}
              {resumeData.experience && resumeData.experience.length > 0 && (
                <div className="mb-4">
                  <div className="text-[12px] font-bold text-black font-sans border-b border-black pb-0.5 mb-1.5">
                    Experience
                  </div>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="flex justify-between items-baseline text-[11px]">
                        <div>
                          <span className="font-bold text-black">{exp.company}</span>
                          {exp.role && <span className="italic text-gray-800"> — {exp.role}</span>}
                        </div>
                        <span className="font-bold text-black text-[10px]">{exp.duration}</span>
                      </div>
                      {exp.bullets && Array.isArray(exp.bullets) && (
                        <ul className="list-disc list-inside text-[10px] text-gray-800 space-y-0.5 pl-1 mt-1">
                          {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resumeData.projects && resumeData.projects.length > 0 && (
                <div className="mb-4">
                  <div className="text-[12px] font-bold text-black font-sans border-b border-black pb-0.5 mb-1.5">
                    Projects
                  </div>
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="text-[11px]">
                        <span className="font-bold text-black">{proj.name}</span>
                        {proj.techStack && <span className="italic text-gray-800"> — {proj.techStack}</span>}
                      </div>
                      {proj.bullets && Array.isArray(proj.bullets) ? (
                        <ul className="list-disc list-inside text-[10px] text-gray-800 space-y-0.5 pl-1 mt-0.5">
                          {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      ) : (
                        proj.description && <p className="text-[10px] text-gray-800 mt-0.5">{proj.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Skills */}
              {resumeData.technicalSkills && (
                <div className="mb-4">
                  <div className="text-[12px] font-bold text-black font-sans border-b border-black pb-0.5 mb-1.5">
                    Technical Skills
                  </div>
                  <div className="text-[10.5px] text-gray-900 space-y-1">
                    {resumeData.technicalSkills.languages && (
                      <div>
                        <span className="font-bold">Programming Languages: </span>
                        {Array.isArray(resumeData.technicalSkills.languages) ? resumeData.technicalSkills.languages.join(', ') : resumeData.technicalSkills.languages}
                      </div>
                    )}
                    {resumeData.technicalSkills.frameworks && (
                      <div>
                        <span className="font-bold">Frameworks & Technologies: </span>
                        {Array.isArray(resumeData.technicalSkills.frameworks) ? resumeData.technicalSkills.frameworks.join(', ') : resumeData.technicalSkills.frameworks}
                      </div>
                    )}
                    {resumeData.technicalSkills.tools && (
                      <div>
                        <span className="font-bold">Tools & Methodologies: </span>
                        {Array.isArray(resumeData.technicalSkills.tools) ? resumeData.technicalSkills.tools.join(', ') : resumeData.technicalSkills.tools}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fallback Skills */}
              {!resumeData.technicalSkills && resumeData.skills && (
                <div className="mb-4">
                  <div className="text-[12px] font-bold text-black font-sans border-b border-black pb-0.5 mb-1.5">
                    Technical Skills
                  </div>
                  <p className="text-[10.5px] text-gray-900">
                    {Array.isArray(resumeData.skills) ? resumeData.skills.join(', ') : resumeData.skills}
                  </p>
                </div>
              )}

              {/* Achievements & Certifications */}
              {resumeData.achievements && (
                <div className="mb-4">
                  <div className="text-[12px] font-bold text-black font-sans border-b border-black pb-0.5 mb-1.5">
                    Achievements & Certifications
                  </div>
                  <ul className="list-disc list-inside text-[10px] text-gray-800 space-y-0.5 pl-1">
                    {Array.isArray(resumeData.achievements) ? (
                      resumeData.achievements.map((ach, i) => <li key={i}>{ach}</li>)
                    ) : (
                      <li>{resumeData.achievements}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            </div>

          </div>

        </div>
      </div>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-print-area, #resume-print-area * {
            visibility: visible;
          }
          #resume-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
          }
        }
        /* html2canvas fix: Explicit hex colors instead of modern lab/oklch functions */
        #resume-print-area .text-gray-800 { color: #1f2937 !important; }
        #resume-print-area .text-gray-900 { color: #111827 !important; }
        #resume-print-area .text-black { color: #000000 !important; }
        #resume-print-area .bg-white { background-color: #ffffff !important; }
        #resume-print-area .border-black { border-color: #000000 !important; }
      `}</style>
    </AppShell>
  );
}
