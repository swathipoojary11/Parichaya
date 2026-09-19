'use client';
import { useRef, useState, useEffect } from 'react';
import { saveResume, addXP } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

export default function ResumeRenderer({ resumeData = {}, onReset }) {
  const { user, updateUser } = useAuth();
  const resumeRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [10, 10, 10, 10], // standard 10mm margin
        filename: `${(resumeData.name || 'Resume').toLowerCase().replace(/\s+/g, '_')}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(resumeRef.current).save();
      
      // Award XP
      if (user?.email) {
        const updated = await addXP(user.email, 150);
        if (updated) updateUser(updated);
      }
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF generation encountered an issue. You can also print this page as PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveToDB = async () => {
    if (!user?.email) return;
    try {
      await saveResume(user.email, resumeData, 'counselor');
      setSaved(true);
      const updated = await addXP(user.email, 50);
      if (updated) updateUser(updated);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save to AuraDB:', err);
    }
  };

  // Safe destructuring with rich fallback values so it's never empty
  const {
    name = 'JOHN DOE',
    contact = { email: 'johndoe@email.com', phone: '+1 234 567 890', linkedin: 'linkedin.com/in/johndoe', github: 'github.com/johndoe', location: 'San Francisco, CA' },
    summary = 'Vision-driven Software Engineer with hands-on exposure in full-stack development, AI/ML integration, and systems programming. My mission is to continuously build production-ready systems that solve meaningful problems. Aspiring to drive digital transformation through efficient software solutions. Demonstrated measurable outcomes by building scalable production-grade projects, directly translating technical skills into organizational excellence.',
    education = [
      { degree: 'Bachelor of Science in Computer Science', institution: 'University of Technology, City, State', year: 'Expected May 2025', bullets: ['Hands-on exposure in core computing concepts, modern web architecture, and AI-driven applications.'] }
    ],
    experience = [
      { title: 'Software Engineering Intern', company: 'Tech Innovators Inc (San Francisco, CA)', duration: 'June 2024 - August 2024', bullets: ['Executed and developed comprehensive backend services using Node.js and Express.', 'Managed data pipelines and optimized SQL queries, reducing response times by 25%.', 'Key Learnings: Applied strategic software architecture patterns to real-world scenarios.'] }
    ],
    projects = [
      { name: 'EcoCharge MS', tech: ['C++', 'JavaScript', 'Systems Design'], description: 'Full-stack EV charging management system featuring a high-performance C++ backend and optimized data structures.', bullets: ['Social/Economic Application: Supports sustainable urban mobility by streamlining charging infrastructure.', 'Roles: Architected backend memory-efficient session tracking and real-time availability updates.'] },
      { name: 'Network Monitor Pro', tech: ['Python', 'Streamlit'], description: 'Real-time network monitoring dashboard with live traffic visualization, sub-second latency tracking, and alert systems.', bullets: ['Roles: Sole developer; deployed secure local port exposure processing 100+ real-time network metrics.'] }
    ],
    skills = {
      languages: ['Java', 'Python', 'C++', 'JavaScript', 'SQL'],
      frameworks: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Next.js'],
      tools: ['Git', 'Docker', 'AWS', 'Linux']
    },
    achievements = [
      'Hackathon Finalist: Top Finalist at National Software Hackathon (100+ teams).',
      'Technical Certifications: AWS Certified Developer Associate, Oracle Certified Java Programmer.'
    ]
  } = resumeData;

  // Function to render skills list safely
  const renderSkillString = (label, arr) => {
    if (!arr || !arr.length) return null;
    return (
      <div className="mb-0.5">
        <span className="font-bold">{label}: </span>
        <span>{Array.isArray(arr) ? arr.join(', ') : arr}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto pb-16 animate-fade-in">
      {/* Top Action Bar - Neo-Brutalist Styling */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full mb-8 p-6 bg-white border-[3px] border-black rounded-[20px] shadow-[6px_6px_0px_#111111]">
        <div className="flex items-center gap-4">
          <span className="text-4xl">📄</span>
          <div>
            <h3 className="font-black text-black text-xl font-['Outfit'] uppercase">Boss-Slaying Resume</h3>
            <p className="text-sm text-gray-600 font-semibold font-['Inter']">Classic ATS-Friendly Template</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleSaveToDB}
            className={`btn-ghost ${saved ? '!bg-green-400' : ''}`}
          >
            {saved ? '✓ Saved!' : '💾 Save to DB'}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-primary !bg-orange-500 hover:!bg-yellow-400 !text-black"
          >
            {downloading ? 'GENERATING PDF...' : '📥 DOWNLOAD PDF'}
          </button>

          {onReset && (
            <button
              onClick={onReset}
              className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase underline"
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      {/* The Printable Resume Paper (Classic Times New Roman format matching PDF) */}
      <div
        ref={resumeRef}
        id="resume-printable"
        className="w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl print:shadow-none mx-auto border border-gray-300 print:border-none p-[12mm]"
        style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '11pt', lineHeight: '1.4', boxSizing: 'border-box' }}
      >
        {/* Name and Contact Info */}
        <div className="text-center mb-4">
          <h1 className="text-[24pt] font-bold uppercase mb-1">{name}</h1>
          <div className="text-[10pt] flex flex-wrap justify-center items-center gap-1">
            {contact.location && <span>{contact.location} • </span>}
            {contact.email && <span className="underline">{contact.email}</span>}
            {contact.phone && <span> • {contact.phone}</span>}
            {contact.linkedin && <span> • {contact.linkedin}</span>}
            {contact.github && <span> • {contact.github}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div className="mb-4">
            <h2 className="text-[12pt] font-bold border-b border-black uppercase pb-0.5 mb-1">Professional Summary</h2>
            <p className="text-[11pt] text-justify">{summary}</p>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-[12pt] font-bold border-b border-black uppercase pb-0.5 mb-2">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between items-baseline font-bold">
                  <span>{edu.institution || 'University Name'}</span>
                  <span>{edu.year || 'Expected 2025'}</span>
                </div>
                <div className="italic">{edu.degree || 'Degree Program'}</div>
                {edu.bullets && edu.bullets.length > 0 && (
                  <ul className="list-disc pl-5 mt-0.5">
                    {edu.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-[12pt] font-bold border-b border-black uppercase pb-0.5 mb-2">Experience</h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex justify-between items-baseline font-bold">
                  <span>{exp.company} — <span className="italic font-normal">{exp.title}</span></span>
                  <span>{exp.duration}</span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc pl-5 mt-1">
                    {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-4">
            <h2 className="text-[12pt] font-bold border-b border-black uppercase pb-0.5 mb-2">Projects</h2>
            {projects.map((proj, idx) => (
              <div key={idx} className="mb-2">
                <div className="font-bold">
                  {proj.name} <span className="font-normal italic">— {Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}</span>
                </div>
                {proj.description && <ul className="list-disc pl-5 mt-0.5"><li>{proj.description}</li></ul>}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc pl-5">
                    {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Technical Skills */}
        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0) && (
          <div className="mb-4">
            <h2 className="text-[12pt] font-bold border-b border-black uppercase pb-0.5 mb-1.5">Technical Skills</h2>
            {renderSkillString('Programming Languages', skills.languages)}
            {renderSkillString('Frameworks & Technologies', skills.frameworks)}
            {renderSkillString('Tools & Methodologies', skills.tools)}
          </div>
        )}

        {/* Achievements & Certifications */}
        {achievements && achievements.length > 0 && (
          <div className="mb-4">
            <h2 className="text-[12pt] font-bold border-b border-black uppercase pb-0.5 mb-1.5">Achievements & Certifications</h2>
            <ul className="list-disc pl-5">
              {achievements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
