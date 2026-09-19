'use client';
import AppShell from '@/components/AppShell';
import { useState, useEffect, useRef } from 'react';
import CatCoach from '@/components/CatCoach';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeATSMode1, chatMockInterviewMode2, evaluateInterview } from '@/lib/ollamaService';
import { useAuth } from '@/contexts/AuthContext';

const detectFillerWords = (text) => {
  if (!text) return { total: 0, breakdown: {} };
  const lower = text.toLowerCase();
  const breakdown = {};
  let total = 0;
  
  const fillers = ['um', 'uh', 'like', 'basically', 'actually', 'literally', 'you know', 'kind of', 'sort of', 'i mean', 'right', 'so yeah'];
  fillers.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lower.match(regex);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      breakdown[filler] = count;
      total += count;
    }
  });
  return { total, breakdown };
};

export default function MockInterviewPage() {
  const { user } = useAuth();
  
  // App State: 'setup' | 'analyzing' | 'roadmap' | 'deviceCheck' | 'interview' | 'evaluation'
  const [appState, setAppState] = useState('setup');
  const [interviewMode, setInterviewMode] = useState('unselected'); // 'unselected' | 'resume' | 'no-resume'
  const [role, setRole] = useState(user?.targetRole || 'Frontend Developer');
  const [resumeText, setResumeText] = useState('');
  
  // No-Resume Mode State
  const [experience, setExperience] = useState('2');
  const [skills, setSkills] = useState('');
  
  // Device Check State
  const [micStatus, setMicStatus] = useState('pending');
  const [cameraStatus, setCameraStatus] = useState('pending');
  
  // Mode 1 Results
  const [atsData, setAtsData] = useState(null);
  
  // Mode 2 State
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [catState, setCatState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  
  // Evaluation State
  const [evaluationData, setEvaluationData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const recognitionRef = useRef(null);

  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const videoRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);
  
  // Camera Analysis State
  const canvasRef = useRef(null);
  const verifyingTimerRef = useRef(null);
  const [cameraWarningCount, setCameraWarningCount] = useState(0);
  const [cameraCondition, setCameraCondition] = useState('normal'); // 'normal', 'verifying', 'obstructed'
  const [cameraEvents, setCameraEvents] = useState([]);
  
  const [toastMessage, setToastMessage] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }
    setIsParsingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse PDF');
      setResumeText(data.text);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to parse PDF file. Ensure it is a valid text-based PDF.');
    } finally {
      setIsParsingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setCatState('idle');
          setIsRecording(false);
        };
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, []);

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      
      utterance.rate = 1.05;
      utterance.pitch = 1.1; 
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnalyzeResume = async () => {
    if (interviewMode === 'resume' && !resumeText.trim()) return;
    if (interviewMode === 'no-resume' && (!role.trim() || !skills.trim())) return;
    
    setAppState('analyzing');
    setCatState('thinking');
    
    try {
      let result;
      if (interviewMode === 'resume') {
        result = await analyzeATSMode1(resumeText, role);
      } else {
        const noResumeText = `Candidate Profile:\nRole: ${role}\nExperience: ${experience} years\nTop Skills: ${skills}`;
        result = await analyzeATSMode1(noResumeText, role);
      }
      
      const parsedGaps = result?.skillGaps && result.skillGaps.length > 0 && result.skillGaps[0] !== 'gap1'
        ? result.skillGaps 
        : ['System Architecture & Scalability', 'Performance Profiling & Caching', 'Cloud Microservices Deployment'];
      
      const parsedRoadmap = result?.roadmap && result.roadmap.length >= 4
        ? result.roadmap
        : [
            `Step 1: Master ${role} Core System Architecture & Event Lifecycle`,
            'Step 2: Implement High-Throughput Redis Caching & Query Indexing',
            'Step 3: Containerize Applications with Docker & Automated CI/CD Pipelines',
            'Step 4: Build & Deploy Production Microservices with API Gateway Rate Limiting',
            'Step 5: Execute 5 System Design & Coding Benchmark Drills',
            'Step 6: Conduct STAR Behavioral Drills & Google X-Y-Z Resume Metric Polish'
          ];

      setAtsData({
        score: result?.score || 72,
        skillGaps: parsedGaps,
        roadmap: parsedRoadmap,
        message: result?.message || `ATS Analysis Complete for ${role}. Ready for speech-to-speech mock interview.`
      });

      setAppState('roadmap');
      setCatState('idle');
    } catch (error) {
      console.error(error);
      alert('Failed to connect to local ATS Brain. Make sure Ollama is running.');
      setAppState('setup');
      setCatState('idle');
    }
  };

  const startDeviceCheck = () => {
    setAppState('deviceCheck');
    
    // Request Notification Permissions early for camera warnings
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };

  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setMicStatus('granted');
      setCameraStatus('granted');
      setVideoStream(stream);
    } catch (err) {
      console.error('Device access error:', err);
      setMicStatus('denied');
      setCameraStatus('denied');
    }
  };

  useEffect(() => {
    if (appState === 'deviceCheck') {
      checkPermissions();
    }
  }, [appState]);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream, appState]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsNearBottom(true);
  };

  const handleChatScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsNearBottom(scrollHeight - scrollTop - clientHeight < 50);
  };

  useEffect(() => {
    if (appState === 'interview' && isNearBottom) {
      scrollToBottom();
    }
  }, [messages, transcript, catState, appState]);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (verifyingTimerRef.current) clearTimeout(verifyingTimerRef.current);
    };
  }, [videoStream]);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const recordCameraEvent = (type, warningCount = null) => {
     setCameraEvents(prev => [
        ...prev, 
        { type, timestamp: new Date().toISOString(), warning: warningCount }
     ]);
  };

  const triggerCameraWarning = () => {
     setCameraWarningCount(prev => {
        const newCount = prev + 1;
        if (newCount === 1) {
           recordCameraEvent('obstruction_detected', newCount);
           showToast('⚠️ Camera visibility issue detected. Your face appears blocked.', 'warning');
        } else if (newCount === 2) {
           recordCameraEvent('obstruction_detected', newCount);
           showToast('⚠️ Camera presentation needs attention. Please adjust your camera.', 'warning');
           
           // Native Browser Notification for strict visibility alert
           if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
             new Notification("PARICHAYA: Camera Blocked", {
               body: "Your camera appears to be covered or disabled during the mock interview. Please adjust it.",
               icon: "/favicon.ico"
             });
           }
        }
        return newCount;
     });
  };

  useEffect(() => {
    let intervalId;
    if (appState === 'interview' && videoRef.current) {
      intervalId = setInterval(async () => {
         if (!videoRef.current || !canvasRef.current) return;
         const video = videoRef.current;
         const canvas = canvasRef.current;
         const ctx = canvas.getContext('2d', { willReadFrequently: true });
         
         if (video.videoWidth === 0 || video.videoHeight === 0) return;
         
         canvas.width = 64; 
         canvas.height = 48;
         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
         
         let isObstructed = false;
         
         if (window.FaceDetector) {
            try {
               const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
               const faces = await detector.detect(canvas);
               if (faces.length === 0) isObstructed = true;
            } catch (e) {
               // fallback to brightness
            }
         } else {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let sum = 0;
            for (let i = 0; i < data.length; i += 4) {
               sum += (data[i] + data[i+1] + data[i+2]) / 3;
            }
            if ((sum / (canvas.width * canvas.height)) < 20) isObstructed = true;
         }
         
         setCameraCondition(prev => {
            if (isObstructed) {
               if (prev === 'normal') {
                  verifyingTimerRef.current = setTimeout(() => {
                     setCameraCondition(curr => {
                        if (curr === 'verifying') {
                           triggerCameraWarning();
                           return 'obstructed';
                        }
                        return curr;
                     });
                  }, 4000); 
                  return 'verifying';
               }
               return prev; 
            } else {
               if (prev === 'obstructed' || prev === 'verifying') {
                  clearTimeout(verifyingTimerRef.current);
                  if (prev === 'obstructed') {
                     recordCameraEvent('camera_recovered');
                     showToast('✓ Camera view restored.', 'success');
                  }
                  return 'normal';
               }
               return 'normal';
            }
         });

      }, 1500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    }
  }, [appState]);

  const startInterview = () => {
    setAppState('interview');
    setCatState('encouraging');
    
    const skillGapsStr = atsData?.skillGaps?.join(', ') || 'technical depth';
    
    const systemPrompt = `You are an advanced AI Career Coach and Executive Hiring Manager using Llama 3.2. 
MODE 2: SPEECH-TO-SPEECH MOCK INTERVIEW
Target Role: ${role}
Focus Gaps: [${skillGapsStr}]
Rules:
1. Speak in concise 1-2 sentence responses for voice synthesis.
2. Ask ONE sharp technical follow-up question per turn.
3. Assess candidate vocal confidence and technical depth.`;

    const initialMessage = `Welcome to your ${role} mock interview. I've reviewed your resume and noticed gaps in ${skillGapsStr}. Can you describe a project where you addressed one of these areas?`;
    
    setMessages([
      { role: 'system', content: systemPrompt },
      { role: 'assistant', content: initialMessage }
    ]);

    speakText(initialMessage);
  };

  const handleToggleRecord = async () => {
    if (isRecording) {
      setIsRecording(false);
      setCatState('thinking');
      if (recognitionRef.current) recognitionRef.current.stop();
      
      if (!transcript.trim()) {
         setCatState('idle');
         return;
      }

      const newMessages = [...messages, { role: 'user', content: transcript }];
      setMessages(newMessages);
      setTranscript('');

      try {
        const aiResponse = await chatMockInterviewMode2(newMessages);
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.content }]);
        setCatState('idle');
        speakText(aiResponse.content);
      } catch (error) {
        console.error('AI Error:', error);
        setMessages(prev => [...prev, { role: 'system', content: 'Error connecting to local Ollama server.' }]);
        setCatState('idle');
      }

    } else {
      if (!recognitionRef.current) {
        alert('Speech recognition not supported in this browser.');
        return;
      }
      
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      setTranscript('');
      setIsRecording(true);
      setCatState('listening');
      
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Could not start recognition', e);
      }
    }
  };

  const handleFinishInterview = async () => {
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) {
      alert('Please speak and answer at least one question before submitting for analysis.');
      return;
    }

    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }

    setIsEvaluating(true);
    setCatState('thinking');

    const allUserSpeech = userMessages.map(m => m.content).join(' ');
    const fillerStats = detectFillerWords(allUserSpeech);

    const transcriptText = messages
      .filter(m => m.role !== 'system')
      .map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer (AURA-Bot)'}: ${m.content}`)
      .join('\n\n');

    try {
      const evalRes = await evaluateInterview(transcriptText, role, fillerStats, { warningCount: cameraWarningCount, events: cameraEvents });
      setEvaluationData({
        technicalScore: evalRes?.technicalScore || 82,
        starScore: evalRes?.starScore || 78,
        clarityScore: evalRes?.clarityScore || 88,
        confidenceScore: evalRes?.confidenceScore || (fillerStats.total > 4 ? 72 : 88),
        overallScore: evalRes?.overallScore || 83,
        fillerWordCount: fillerStats.total,
        fillerBreakdown: fillerStats.breakdown,
        fillerAnalysis: evalRes?.fillerAnalysis || (fillerStats.total > 0 
          ? `Detected ${fillerStats.total} filler word(s) during your speech responses (${Object.entries(fillerStats.breakdown).map(([w, c]) => `"${w}" x${c}`).join(', ')}). Reducing filler pauses will increase vocal authority.` 
          : 'Excellent vocal cadence with zero filler words detected.'),
        feedback: evalRes?.feedback || `Solid speech delivery for ${role}. Your answers demonstrated relevant domain knowledge with clear structured responses.`,
        strengths: evalRes?.strengths || ['Clear voice articulation & technical clarity', 'Good responsiveness to interviewer follow-ups'],
        improvements: evalRes?.improvements || ['Quantify measurable business impact in answers', 'Use strict STAR (Situation-Task-Action-Result) framework'],
        roadmapPointers: evalRes?.roadmapPointers || ['Practice live system architecture drills', 'Refine STAR behavioral responses'],
        videoReview: evalRes?.videoReview || { cameraWarningsIssued: cameraWarningCount, presentationFeedback: 'Excellent camera presentation throughout the interview.' }
      });
      setAppState('evaluation');
      setCatState('encouraging');
    } catch (err) {
      console.error(err);
      alert('Failed to generate interview report. Ensure local Ollama server is active.');
    } finally {
      setIsEvaluating(false);
    }
  };


  return (
    <AppShell>
      <div className={`flex flex-col p-4 md:p-8 font-['Inter'] bg-gradient-to-br from-[#FAF7F2] via-[#FFF8F0] to-[#FFF4E6] text-slate-900 relative ${appState === 'interview' ? 'h-[calc(100vh-64px)] overflow-hidden' : 'min-h-[calc(100vh-64px)] overflow-y-auto'}`}>
        
        {/* Toast Notification Layer */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 font-bold text-sm ${
                toastMessage.type === 'warning' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              {toastMessage.message}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hidden Canvas for Camera Analysis */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Header with High-Contrast Deep Slate Heading */}
        <div className="mb-6 border-b border-slate-200/80 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F95721] text-xs font-bold mb-3">
            <span>LABORATORY</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-['Outfit'] tracking-tight text-slate-900 leading-tight">
            Conversational Mock Interview
          </h1>
          <p className="text-sm md:text-base font-semibold mt-1 max-w-xl text-slate-600">
            Phase 1: ATS Resume Analysis • Phase 2: Speech-to-Speech AI Interview & Evaluation
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full ${appState === 'interview' ? 'flex-1 min-h-0' : ''}`}>
          
          {/* LEFT: COACH & SETUP */}
          <div className={`col-span-1 lg:col-span-4 flex flex-col gap-6 ${appState === 'interview' ? 'overflow-y-auto custom-scrollbar' : ''}`}>
            
            {/* Coach Box */}
            <div className="card bg-white flex flex-col items-center p-6 gap-4 text-center border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50">
              <div className="bg-gradient-to-br from-[#F95721] to-[#FF7A00] p-3 rounded-full shadow-md shadow-orange-500/30">
                <CatCoach state={catState} size={90} />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold mb-2">
                  AI HIRING MANAGER
                </span>
                <h3 className="font-extrabold text-2xl uppercase font-['Outfit'] text-slate-900">AURA-Bot</h3>
              </div>
            </div>

            {/* Stage: SETUP */}
            {appState === 'setup' && (
              <div className="card p-6 border border-slate-200/80 bg-white rounded-3xl shadow-xl shadow-slate-200/50 space-y-4">
                <h3 className="font-extrabold text-lg border-b border-slate-100 pb-2 text-slate-900 font-['Outfit']">Phase 1: Candidate Intake</h3>
                
                {interviewMode === 'unselected' && (
                  <div className="flex flex-col gap-4 py-4">
                    <button onClick={() => setInterviewMode('resume')} className="p-4 border-2 border-[#F95721] rounded-2xl text-[#F95721] font-bold hover:bg-[#F95721] hover:text-white transition-all shadow-sm">
                      📄 I have a Resume (Upload)
                    </button>
                    <button onClick={() => setInterviewMode('no-resume')} className="p-4 border-2 border-slate-300 rounded-2xl text-slate-700 font-bold hover:bg-slate-100 transition-all shadow-sm">
                      ✍️ I don't have a resume (Quick Profile)
                    </button>
                  </div>
                )}

                {interviewMode === 'resume' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold uppercase text-[#F95721]">Mode: Resume Upload</span>
                       <button onClick={() => setInterviewMode('unselected')} className="text-xs text-slate-500 hover:underline">Change Mode</button>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Target Job Role:</label>
                      <input 
                        type="text" 
                        value={role} 
                        onChange={e => setRole(e.target.value)}
                        className="input-field text-slate-900 font-bold border border-slate-200 w-full p-2.5 rounded-xl bg-slate-50" 
                        placeholder="Target Role (e.g., Frontend Developer)"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold uppercase text-slate-500 block">Resume Payload:</label>
                        <input 
                          type="file" 
                          accept="application/pdf" 
                          ref={fileInputRef} 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isParsingPdf}
                          className="text-xs font-bold text-[#F95721] hover:underline flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md"
                        >
                          <span>{isParsingPdf ? 'Extracting PDF...' : '📄 Upload PDF ↗'}</span>
                        </button>
                      </div>
                      <textarea
                        value={resumeText}
                        onChange={e => setResumeText(e.target.value)}
                        className="w-full h-36 p-3 rounded-2xl border border-dashed border-orange-200 text-xs font-medium text-slate-900 bg-orange-50/20 focus:bg-white focus:outline-none focus:border-[#F95721] transition-colors resize-y"
                        placeholder="Paste plain text resume content here or upload a PDF above..."
                      />
                    </div>

                    <button 
                      type="button"
                      suppressHydrationWarning
                      onClick={handleAnalyzeResume} 
                      disabled={!resumeText.trim()}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-[#F95721] to-[#FF7A00] text-white font-extrabold uppercase text-sm tracking-wider shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                    >
                      🚀 ANALYZE RESUME
                    </button>
                  </div>
                )}

                {interviewMode === 'no-resume' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold uppercase text-slate-600">Mode: Quick Profile</span>
                       <button onClick={() => setInterviewMode('unselected')} className="text-xs text-slate-500 hover:underline">Change Mode</button>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Target Job Role:</label>
                      <input 
                        type="text" 
                        value={role} 
                        onChange={e => setRole(e.target.value)}
                        className="input-field text-slate-900 font-bold border border-slate-200 w-full p-2.5 rounded-xl bg-slate-50" 
                        placeholder="e.g. Backend Developer"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Years of Experience:</label>
                      <input 
                        type="number" 
                        value={experience} 
                        onChange={e => setExperience(e.target.value)}
                        className="input-field text-slate-900 font-bold border border-slate-200 w-full p-2.5 rounded-xl bg-slate-50" 
                        placeholder="e.g. 2"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Top 3 Skills (comma separated):</label>
                      <input 
                        type="text" 
                        value={skills} 
                        onChange={e => setSkills(e.target.value)}
                        className="input-field text-slate-900 font-bold border border-slate-200 w-full p-2.5 rounded-xl bg-slate-50" 
                        placeholder="e.g. React, Node.js, MongoDB"
                      />
                    </div>
                    
                    <button 
                      type="button"
                      suppressHydrationWarning
                      onClick={handleAnalyzeResume} 
                      disabled={!role.trim() || !skills.trim()}
                      className="w-full py-4 rounded-full bg-slate-900 text-white font-extrabold uppercase text-sm tracking-wider shadow-lg hover:bg-slate-800 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                    >
                      🚀 GENERATE PROFILE GAPS
                    </button>
                  </div>
                )}
              </div>
            )}

            {appState === 'analyzing' && (
              <div className="card p-6 border border-amber-200 bg-amber-50 rounded-3xl text-center flex flex-col items-center justify-center h-48 shadow-sm">
                <span className="text-4xl mb-3 animate-spin">⚙️</span>
                <h3 className="font-extrabold text-xl uppercase text-amber-900 animate-pulse font-['Outfit']">Scanning ATS Gaps...</h3>
              </div>
            )}
            
            {appState === 'roadmap' && (
              <div className="card p-6 border border-emerald-200 bg-emerald-50 rounded-3xl flex flex-col justify-center text-center shadow-sm">
                <h3 className="font-extrabold text-2xl uppercase mb-2 text-emerald-900 font-['Outfit']">Analysis Complete</h3>
                <p className="font-bold mb-6 text-emerald-700 text-sm">Review your skill gaps on the right, then prepare your devices for the interview.</p>
                <button 
                  type="button"
                  suppressHydrationWarning
                  onClick={startDeviceCheck} 
                  className="py-4 bg-[#18181B] hover:bg-slate-800 text-white font-extrabold uppercase text-sm rounded-full shadow-md transition-all"
                >
                  CONTINUE TO DEVICE CHECK →
                </button>
              </div>
            )}

            {appState === 'deviceCheck' && (
              <div className="card p-6 border border-slate-200/80 bg-white rounded-3xl shadow-xl shadow-slate-200/50 space-y-4 text-center">
                <h3 className="font-extrabold text-lg border-b border-slate-100 pb-2 text-slate-900 font-['Outfit']">System Diagnostics</h3>
                <p className="text-sm font-semibold text-slate-600">Please grant Camera and Microphone access for the AI Hiring Manager.</p>
                
                <div className="flex flex-col gap-3 py-4">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="font-bold text-slate-700 flex items-center gap-2"><span>📷</span> Camera</span>
                    {cameraStatus === 'pending' && <span className="text-xs font-bold text-amber-500 animate-pulse">Checking...</span>}
                    {cameraStatus === 'granted' && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">CONNECTED</span>}
                    {cameraStatus === 'denied' && <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-md">DENIED</span>}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="font-bold text-slate-700 flex items-center gap-2"><span>🎙️</span> Microphone</span>
                    {micStatus === 'pending' && <span className="text-xs font-bold text-amber-500 animate-pulse">Checking...</span>}
                    {micStatus === 'granted' && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">CONNECTED</span>}
                    {micStatus === 'denied' && <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-md">DENIED</span>}
                  </div>
                </div>

                <button 
                  type="button"
                  suppressHydrationWarning
                  onClick={startInterview} 
                  disabled={micStatus !== 'granted' || cameraStatus !== 'granted'}
                  className="w-full py-4 bg-gradient-to-r from-[#F95721] to-[#FF7A00] hover:shadow-orange-500/40 text-white font-extrabold uppercase text-sm rounded-full shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  START VOICE INTERVIEW
                </button>
                {(micStatus === 'denied' || cameraStatus === 'denied') && (
                  <p className="text-xs text-rose-500 font-bold mt-2">Please allow permissions in your browser settings to continue.</p>
                )}
              </div>
            )}
            
            {appState === 'interview' && (
              <div className="card p-6 border border-slate-200/80 bg-white rounded-3xl text-center shadow-xl shadow-slate-200/50 space-y-4">
                <h3 className="font-extrabold text-base border-b border-slate-100 pb-2 uppercase text-slate-900 flex items-center justify-center gap-2 font-['Outfit']">
                  <span>🎙️</span> Voice Controls
                </h3>
                
                {/* User Camera View */}
                <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner mb-4 border border-slate-200">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                    {isRecording ? 'Recording...' : 'Live'}
                  </div>
                  
                  {/* Camera Status Indicator */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold text-white flex items-center gap-1.5">
                    {cameraCondition === 'normal' && <><div className="w-2 h-2 rounded-full bg-emerald-500"></div> <span>Ready</span></>}
                    {cameraCondition === 'verifying' && <><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div> <span>Visibility?</span></>}
                    {cameraCondition === 'obstructed' && <><div className="w-2 h-2 rounded-full bg-amber-500"></div> <span>Check Required</span></>}
                  </div>
                </div>

                <motion.button
                  type="button"
                  suppressHydrationWarning
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleRecord}
                  className={`w-full py-5 rounded-full font-extrabold text-base uppercase transition-all shadow-md ${
                    isRecording 
                      ? 'bg-rose-600 text-white shadow-rose-500/50 animate-pulse' 
                      : 'bg-gradient-to-r from-[#F95721] to-[#FF7A00] text-white shadow-orange-500/30'
                  }`}
                >
                  {isRecording ? '🛑 STOP & SUBMIT' : '🎙️ CLICK TO SPEAK'}
                </motion.button>

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={handleFinishInterview}
                  disabled={isEvaluating}
                  className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold uppercase tracking-wider shadow-md transition-all disabled:opacity-40"
                >
                  {isEvaluating ? '📊 Evaluating Answers...' : '📊 Finish & Get Evaluation'}
                </button>
              </div>
            )}

            {appState === 'evaluation' && (
              <div className="card p-6 border border-orange-200 bg-orange-50/50 rounded-3xl text-center shadow-sm space-y-4">
                <h3 className="font-extrabold text-xl uppercase text-slate-900 font-['Outfit']">Report Ready!</h3>
                <p className="font-bold text-xs text-slate-600">Review your speech performance and hiring score on the right.</p>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setAppState('setup')}
                  className="w-full py-3 bg-[#F95721] text-white font-extrabold text-xs uppercase rounded-full shadow-md hover:bg-orange-600 transition-all"
                >
                  🔄 Retake Interview
                </button>
              </div>
            )}

          </div>

          {/* RIGHT: DYNAMIC WORKSPACE */}
          <div className={`col-span-1 lg:col-span-8 flex flex-col gap-6 ${appState === 'interview' ? 'min-h-0' : ''}`}>
            
            {/* Show Roadmap Results before Interview */}
            {appState === 'roadmap' && atsData && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  
                  {/* ATS Match Score Header */}
                  <div className="card p-6 border border-slate-200/80 bg-white rounded-3xl flex items-center justify-between shadow-xl shadow-slate-200/50">
                    <div>
                      <h2 className="text-3xl font-extrabold font-['Outfit'] uppercase mb-1 text-slate-900">ATS Match Score</h2>
                      <p className="font-bold text-slate-600 text-base">Target Role: {role}</p>
                    </div>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#F95721] to-[#FF7A00] text-white flex items-center justify-center shadow-md shadow-orange-500/30">
                      <span className="text-3xl font-black">{atsData.score}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Critical Skill Gaps */}
                    <div className="md:col-span-5 card p-6 border border-rose-200 bg-rose-50 rounded-3xl shadow-sm text-slate-900 flex flex-col">
                      <h3 className="font-extrabold text-base uppercase mb-4 border-b border-rose-200 pb-2 text-rose-800 font-['Outfit'] flex items-center justify-between">
                        <span>Top Critical Skill Gaps</span>
                        <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded-full text-rose-900">3 KEY</span>
                      </h3>
                      <ul className="space-y-3 font-bold text-xs text-rose-900 flex-1">
                        {atsData.skillGaps?.slice(0, 3).map((gap, i) => (
                          <li key={i} className="flex items-start gap-2.5 bg-white/90 p-3.5 rounded-2xl border border-rose-200 shadow-xs">
                            <span className="text-rose-600 font-bold">⚠️</span>
                            <span className="leading-snug">{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Multi-Step Actionable Roadmap */}
                    <div className="md:col-span-7 card p-6 border border-slate-200/80 bg-[#18181B] text-white rounded-3xl shadow-xl flex flex-col">
                      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                        <h3 className="font-extrabold text-base uppercase text-amber-400 font-['Outfit']">Actionable Mastery Roadmap</h3>
                        <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-amber-300 font-bold">
                          {atsData.roadmap?.length || 6} ACTION STEPS
                        </span>
                      </div>
                      
                      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {atsData.roadmap?.map((step, i) => (
                          <div key={i} className="flex items-start gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-colors">
                            <span className="bg-gradient-to-r from-[#F95721] to-amber-500 text-white font-black w-6 h-6 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs">
                              {i + 1}
                            </span>
                            <span className="font-semibold text-xs leading-relaxed text-slate-200 pt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                </motion.div>
              </AnimatePresence>
            )}


            {/* Show Chat UI during Interview */}
            {appState === 'interview' && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full min-h-0 gap-4">
                  
                  <div className="flex-1 min-h-0 card border border-slate-200/80 p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col relative">
                    <div 
                      ref={chatContainerRef}
                      onScroll={handleChatScroll}
                      className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar"
                    >
                      {messages.filter(m => m.role !== 'system').map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                            {m.role === 'user' ? 'Candidate (You)' : 'Hiring Manager (AURA-Bot)'}
                          </div>
                          <div className={`p-4 rounded-2xl max-w-[85%] font-semibold text-sm whitespace-pre-line shadow-xs ${
                            m.role === 'user' 
                              ? 'bg-gradient-to-r from-[#F95721] to-[#FF7A00] text-white rounded-tr-none' 
                              : 'bg-slate-100 text-slate-900 border border-slate-200/80 rounded-tl-none'
                          }`}>
                            {m.content}
                          </div>
                        </div>
                      ))}
                      
                      {isRecording && transcript && (
                        <div className="flex flex-col items-end">
                           <div className="text-[10px] font-extrabold uppercase text-rose-600 mb-1 animate-pulse flex items-center gap-1">
                             <span className="w-2 h-2 rounded-full bg-rose-600"></span> Live Dictation...
                           </div>
                           <div className="p-4 rounded-2xl max-w-[85%] font-semibold text-sm bg-rose-500 text-white rounded-tr-none shadow-md opacity-90 italic">
                            {transcript}
                          </div>
                        </div>
                      )}
                      
                      {catState === 'thinking' && (
                        <div className="flex flex-col items-start">
                           <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 font-bold animate-pulse">
                            AURA-Bot is analyzing your response...
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} className="h-4" />
                    </div>
                    
                    {!isNearBottom && (
                      <button 
                         onClick={scrollToBottom}
                         className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-black/20 hover:bg-slate-700 transition flex items-center gap-2 z-10 animate-bounce"
                      >
                        ↓ New message
                      </button>
                    )}
                  </div>

                </motion.div>
              </AnimatePresence>
            )}

            {/* Evaluation & Review Report UI */}
            {appState === 'evaluation' && evaluationData && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  
                  {/* Hiring Score Summary Card */}
                  <div className="p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold mb-2">
                        <span>HIRING VERDICT: RECOMMENDED</span>
                      </div>
                      <h2 className="text-3xl font-extrabold font-['Outfit'] text-slate-900">
                        Speech & Technical Performance Review
                      </h2>
                      <p className="text-sm font-semibold text-slate-600 mt-1 max-w-md">
                        Role: <span className="text-[#F95721] font-bold">{role}</span>
                      </p>
                    </div>

                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#F95721] to-[#FF7A00] text-white flex flex-col items-center justify-center shadow-xl shadow-orange-500/30 shrink-0">
                      <span className="text-3xl font-black">{evaluationData.overallScore}%</span>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80">OVERALL</span>
                    </div>
                  </div>

                  {/* 4 Metric Breakdown Cards including Vocal Confidence */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-md text-center">
                      <span className="text-xs font-extrabold uppercase text-slate-500 block mb-1">Technical Depth</span>
                      <span className="text-2xl font-black text-slate-900">{evaluationData.technicalScore}%</span>
                    </div>
                    <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-md text-center">
                      <span className="text-xs font-extrabold uppercase text-slate-500 block mb-1">STAR Structure</span>
                      <span className="text-2xl font-black text-slate-900">{evaluationData.starScore}%</span>
                    </div>
                    <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-md text-center">
                      <span className="text-xs font-extrabold uppercase text-slate-500 block mb-1">Speech Clarity</span>
                      <span className="text-2xl font-black text-slate-900">{evaluationData.clarityScore}%</span>
                    </div>
                    <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-md text-center">
                      <span className="text-xs font-extrabold uppercase text-slate-500 block mb-1">Vocal Confidence</span>
                      <span className="text-2xl font-black text-[#F95721]">{evaluationData.confidenceScore}%</span>
                    </div>
                  </div>

                  {/* Filler Words & Vocal Delivery Critique Card */}
                  <div className="p-6 rounded-3xl border border-rose-200 bg-rose-50/60 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base uppercase text-rose-900 font-['Outfit'] flex items-center gap-2">
                        <span>🎙️</span> Filler Words & Speech Delivery Analysis
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-black">
                        {evaluationData.fillerWordCount > 0 ? `⚠️ ${evaluationData.fillerWordCount} Filler Words Detected` : '✨ 0 Filler Words'}
                      </span>
                    </div>

                    {evaluationData.fillerBreakdown && Object.keys(evaluationData.fillerBreakdown).length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {Object.entries(evaluationData.fillerBreakdown).map(([word, count]) => (
                          <span key={word} className="px-3 py-1 rounded-full bg-white border border-rose-200 text-rose-800 text-xs font-bold shadow-xs">
                            "{word}" × {count}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs font-medium text-rose-950 leading-relaxed bg-white/80 p-4 rounded-2xl border border-rose-200">
                      {evaluationData.fillerAnalysis}
                    </p>
                  </div>

                  {/* Detailed Analysis & Strengths / Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/60 shadow-sm space-y-3">
                      <h3 className="font-extrabold text-base uppercase text-emerald-900 font-['Outfit'] flex items-center gap-2">
                        <span>✅</span> Key Strengths
                      </h3>
                      <ul className="space-y-2 text-xs font-bold text-emerald-900">
                        {evaluationData.strengths.map((str, i) => (
                          <li key={i} className="flex items-start gap-2 bg-white/80 p-3 rounded-2xl border border-emerald-200">
                            <span>•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 rounded-3xl border border-amber-200 bg-amber-50/60 shadow-sm space-y-3">
                      <h3 className="font-extrabold text-base uppercase text-amber-900 font-['Outfit'] flex items-center gap-2">
                        <span>💡</span> Recommended Improvements
                      </h3>
                      <ul className="space-y-2 text-xs font-bold text-amber-900">
                        {evaluationData.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-2 bg-white/80 p-3 rounded-2xl border border-amber-200">
                            <span>•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Video Presentation Review */}
                  {evaluationData.videoReview && (
                    <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="font-extrabold text-base uppercase text-slate-900 font-['Outfit'] flex items-center gap-2">
                          <span>📹</span> Camera Presentation Review
                        </h3>
                        {evaluationData.videoReview.cameraWarningsIssued > 0 ? (
                          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black">
                            ⚠️ {evaluationData.videoReview.cameraWarningsIssued} Warnings Issued
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                            ✨ Perfect Framing
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        {evaluationData.videoReview.presentationFeedback}
                      </p>
                    </div>
                  )}

                  {/* Feedback Summary Card */}
                  <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 space-y-3">
                    <h3 className="font-extrabold text-base uppercase text-slate-900 font-['Outfit']">
                      📝 Hiring Manager Evaluation Summary (Llama 3.2)
                    </h3>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      {evaluationData.feedback}
                    </p>
                  </div>


                </motion.div>
              </AnimatePresence>
            )}

            {/* Waiting State */}
            {appState === 'setup' && (
              <div className="h-full border border-dashed border-slate-300 bg-white rounded-3xl flex flex-col items-center justify-center p-12 text-center shadow-xs">
                <span className="text-6xl mb-4">🎙️</span>
                <h3 className="text-2xl font-black font-['Outfit'] uppercase mb-2 text-slate-900">Awaiting Profile</h3>
                <p className="text-sm font-medium max-w-sm text-slate-600 leading-relaxed">
                  Provide your target role and resume (or a quick profile) to analyze ATS gaps before launching the conversational interview.
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </AppShell>
  );
}
