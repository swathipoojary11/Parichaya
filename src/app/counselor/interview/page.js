'use client';
import { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import CatCoach from '@/components/CatCoach';
import { useRouter } from 'next/navigation';

export default function ResumeBuilderInterviewPage() {
  const router = useRouter();

  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: "Hello! I'm PARICHAYA. To build your professional resume, I'll ask you about 7 questions regarding your background, skills, projects, and achievements. Let's start: What is your full name, location, contact details (email/LinkedIn/GitHub), and target job role?" }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);

  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);
  const welcomeSpokenRef = useRef(false);

  useEffect(() => {
    if (!welcomeSpokenRef.current) {
      welcomeSpokenRef.current = true;
      speakText(chatHistory[0].content);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, userAnswer]);

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    window.speechSynthesis?.cancel();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    let baseText = userAnswer;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setUserAnswer(prev => {
          const spacing = prev && !prev.endsWith(' ') ? ' ' : '';
          return prev + spacing + finalTranscript;
        });
      }
    };

    recognitionRef.current.onerror = (err) => {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const handleUserSubmit = async (e) => {
    if (e) e.preventDefault();
    const text = userAnswer.trim();
    if (!text || isProcessing) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const newHistory = [...chatHistory, { role: 'user', content: text }];
    setChatHistory(newHistory);
    setUserAnswer('');
    setIsProcessing(true);
    setQuestionCount(prev => prev + 1);

    if (questionCount >= 7) {
      const concludingMessage = "Thank you! I have collected all the details. Synthesizing your professional resume now...";
      setChatHistory(prev => [...prev, { role: 'assistant', content: concludingMessage }]);
      speakText(concludingMessage);
      await performExtraction(newHistory);
      return;
    }

    try {
      const promptContext = `You are PARICHAYA, a senior career consultant. Conduct a structured 7-question interview to build a top-tier tech resume.
Questions to cover across the interview:
1. Name, location, contact info (Email, LinkedIn, GitHub), and target role.
2. Education details (College/University, Degree, Expected Graduation).
3. Experience or Internships (Company, Role, Duration, key contributions).
4. Major Technical Projects (Title, Tech stack, description & key metrics).
5. Technical Skills (Programming languages, Frameworks/Tech, Tools/Methodologies).
6. Achievements, Certifications, Hackathons, or Training Programs.
7. Professional summary / career ambition or extra personal details.

This is Question ${questionCount + 1} of 7.
Review the conversation history and ask ONE relevant follow-up question. Keep responses friendly, concise, and focused.`;

      const formattedHistory = newHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
      const prompt = `${promptContext}\n\nConversation History:\n${formattedHistory}\n\nAssistant:`;

      const res = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          prompt: prompt,
          stream: false,
          options: { temperature: 0.7, num_predict: 200 }
        }),
      });

      const data = await res.json();
      const aiResponse = data.response ? data.response.trim() : "Could you tell me more about your recent projects and key achievements?";

      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      speakText(aiResponse);

    } catch (err) {
      console.error(err);
      const fallback = "Let's continue! Could you share your technical skills (Languages, Frameworks, and Tools) and any key certifications?";
      setChatHistory(prev => [...prev, { role: 'assistant', content: fallback }]);
      speakText(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  const performExtraction = async (history) => {
    setIsExtracting(true);
    try {
      const formattedHistory = history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
      const prompt = `Extract structured resume information from this conversation history into a precise JSON object matching the format below.
CRITICAL: The resume MUST be extensive enough to fill a full 8.5x11 page. 
- The 'summary' must be a detailed, professional paragraph (at least 4-5 sentences) highlighting key strengths and career trajectory.
- For EVERY 'experience' and 'project', you MUST generate 4 to 5 highly detailed bullet points (15-25 words each). Focus on technical details, measurable impact, and responsibilities. If the user provided sparse details, professionally extrapolate standard responsibilities for their role to ensure the resume is robust and full.
Do not include markdown or extra text, return ONLY valid JSON:
{
  "name": "Full Name",
  "location": "City, State/Country",
  "email": "email@example.com",
  "linkedin": "linkedin.com/in/username",
  "github": "github.com/username",
  "role": "Target Job Title",
  "summary": "High impact professional summary paragraph",
  "education": [
    {
      "institution": "College or University Name",
      "location": "City, State",
      "expectedDate": "Expected June 2028",
      "degree": "Bachelor of Engineering in Computer Science",
      "details": ["Hands-on exposure in core computing concepts..."]
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "location": "Location",
      "role": "Intern / Software Engineer",
      "duration": "June 2025 – March 2026",
      "bullets": [
        "Executed and developed comprehensive strategies...",
        "Managed digital pipelines..."
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Title",
      "techStack": "Python, Streamlit, PostgreSQL",
      "bullets": [
        "Real-time network monitoring dashboard...",
        "Reduces IT costs for small businesses..."
      ]
    }
  ],
  "technicalSkills": {
    "languages": ["C", "C++", "Python", "SQL", "JavaScript", "Java"],
    "frameworks": ["React", "Node.js", "Flask", "Streamlit", "MongoDB", "SQLite", "Tailwind CSS"],
    "tools": ["Git", "GitHub", "Vercel", "ngrok", "Prompt Engineering", "OOP"]
  },
  "achievements": [
    "Hackathon Finalist: Top Finalist at National software hackathon",
    "Technical Certifications: SQL, Java, C, Prompt Engineering"
  ]
}

Conversation History:
${formattedHistory}`;

      const res = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          prompt: prompt,
          stream: false,
          format: 'json',
          options: { temperature: 0.1 }
        }),
      });

      const data = await res.json();
      localStorage.setItem('parichaya_extracted_resume', data.response);

      const finalMessage = "Resume profile synthesized! Complete the mandatory Soft Skills Assessment to generate your final formatted resume and career roadmap.";
      setChatHistory(prev => [...prev, { role: 'assistant', content: finalMessage }]);
      speakText(finalMessage);

      setTimeout(() => {
        router.push('/arena?game=softskills&returnTo=/counselor/results');
      }, 4000);

    } catch (err) {
      console.error(err);
      alert('Failed to extract resume data. Please make sure Ollama is active.');
      setIsExtracting(false);
    }
  };

  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;

  return (
    <AppShell>
      <div className="p-4 lg:p-6 max-w-4xl mx-auto min-h-[calc(100vh-80px)] flex flex-col font-['Inter'] animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b-[4px] border-black pb-4 mb-4">
          <CatCoach state={isListening ? 'listening' : isProcessing ? 'thinking' : isExtracting ? 'celebrating' : 'idle'} size={70} />
          <div>
            <div className="badge badge-teal mb-1 font-bold uppercase tracking-widest text-[10px]">Step 1 of 2</div>
            <h1 className="text-2xl md:text-3xl font-black font-['Outfit'] uppercase">AI Career Counselor Interview</h1>
            <p className="text-xs font-semibold text-gray-600">Question {Math.min(questionCount, 7)} of 7</p>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4 max-h-[50vh]">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-4 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#111] font-medium text-sm whitespace-pre-line ${
                  msg.role === 'user' ? 'bg-[#FF7A18] text-white font-semibold' : 'bg-white text-black'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isProcessing && (
             <div className="flex justify-start">
               <div className="p-4 rounded-2xl border-[3px] border-black bg-gray-100 font-bold text-sm text-gray-500 animate-pulse">
                 PARICHAYA is processing...
               </div>
             </div>
          )}
          {isExtracting && (
             <div className="flex justify-center my-4">
               <div className="p-4 rounded-2xl border-[3px] border-[#2EC4B6] bg-[#2EC4B6]/10 font-black text-[#2EC4B6] uppercase tracking-widest flex items-center gap-3">
                 <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                 Synthesizing Resume PDF Data...
               </div>
             </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* User Input & Add-On Area */}
        <div className="mt-auto border-t-[3px] border-black pt-4 bg-white rounded-2xl p-4 border-[3px] shadow-[6px_6px_0px_#111]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-gray-700 tracking-wider">Your Answer (Speak or Type • Unlimited Length):</span>
            <span className="text-xs font-bold text-[#FF7A18] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              {wordCount} Words
            </span>
          </div>

          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer, or click the mic button below to dictate. You can add extra details or speak long explanations (up to 2000+ words) before submitting!"
            disabled={isProcessing || isExtracting}
            rows={4}
            className="w-full p-3 text-sm font-semibold rounded-xl border-[2px] border-black text-black placeholder-gray-400 focus:outline-none focus:border-[#FF7A18] resize-y mb-3"
          />

          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={toggleListening}
                disabled={isProcessing || isExtracting}
                className={`h-12 px-5 rounded-xl border-[2px] border-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse shadow-[2px_2px_0px_#111]' 
                    : 'bg-[#2EC4B6] text-white shadow-[3px_3px_0px_#111] hover:translate-y-0.5'
                }`}
              >
                <span>{isListening ? '🛑 Stop Recording' : '🎙️ Dictate Speech'}</span>
              </button>

              {userAnswer && (
                <button
                  type="button"
                  onClick={() => setUserAnswer('')}
                  disabled={isProcessing || isExtracting}
                  className="h-12 px-4 rounded-xl border-[2px] border-black bg-gray-200 text-gray-800 font-bold text-xs uppercase hover:bg-gray-300"
                >
                  Clear Text
                </button>
              )}
            </div>

            <button 
              type="button"
              onClick={handleUserSubmit}
              disabled={!userAnswer.trim() || isProcessing || isExtracting}
              className="h-12 px-8 rounded-xl border-[2px] border-black bg-[#FF7A18] text-white font-black uppercase text-xs shadow-[3px_3px_0px_#111] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#111] disabled:opacity-40 transition-all flex items-center gap-2"
            >
              <span>Submit Answer & Continue</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
