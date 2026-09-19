'use client';
import AppShell from '@/components/AppShell';
import { useRouter } from 'next/navigation';

export default function CounselorPage() {
  const router = useRouter();

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in font-['Inter']">
        <div className="mb-12 border-b-[4px] border-black pb-4">
          <p className="badge badge-teal mb-2 font-bold uppercase tracking-widest text-xs">AI CAREER COUNSELLOR</p>
          <h1 className="text-4xl md:text-5xl font-black font-['Outfit'] uppercase tracking-tight">
            Build Your Career Profile
          </h1>
          <p className="text-lg font-semibold mt-2 max-w-2xl text-gray-700">
            Choose your starting point. All analysis runs securely via local AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-scale-in">
          {/* Option A */}
          <div 
            onClick={() => router.push('/ats')}
            className="group cursor-pointer rounded-2xl p-8 bg-white border-[4px] border-black shadow-[8px_8px_0px_#111] hover:shadow-[12px_12px_0px_#FF7A18] hover:-translate-y-1 hover:border-[#FF7A18] transition-all duration-200 flex flex-col h-full"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#FF7A18] border-[3px] border-black flex items-center justify-center text-3xl shadow-[4px_4px_0px_#111]">
                📄
              </div>
              <div className="badge bg-[#FF7A18] text-white border-2 border-black font-black uppercase text-xs">PDF Upload + AI Audit</div>
            </div>
            
            <h3 className="text-2xl font-black mb-3 font-['Outfit'] uppercase">I Have a Resume</h3>
            <p className="text-base font-semibold text-gray-600 mb-8 flex-grow">
              Upload your PDF resume. PARICHAYA will run a deep ATS audit against your target role using local AI.
            </p>
            
            <div className="flex items-center justify-between font-black uppercase tracking-wider group-hover:text-[#FF7A18] transition-colors">
              <span>Run ATS Scan</span>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>

          {/* Option B */}
          <div 
            onClick={() => router.push('/counselor/interview')}
            className="group cursor-pointer rounded-2xl p-8 bg-white border-[4px] border-black shadow-[8px_8px_0px_#111] hover:shadow-[12px_12px_0px_#2EC4B6] hover:-translate-y-1 hover:border-[#2EC4B6] transition-all duration-200 flex flex-col h-full"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#2EC4B6] border-[3px] border-black flex items-center justify-center text-3xl shadow-[4px_4px_0px_#111]">
                🎙️
              </div>
              <div className="badge bg-[#2EC4B6] text-white border-2 border-black font-black uppercase text-xs">Interview → Resume</div>
            </div>
            
            <h3 className="text-2xl font-black mb-3 font-['Outfit'] uppercase">I Don't Have a Resume</h3>
            <p className="text-base font-semibold text-gray-600 mb-8 flex-grow">
              Complete a voice mock interview and a soft skills assessment. PARICHAYA will construct a professional resume for you.
            </p>
            
            <div className="flex items-center justify-between font-black uppercase tracking-wider group-hover:text-[#2EC4B6] transition-colors">
              <span>Start Interview</span>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
