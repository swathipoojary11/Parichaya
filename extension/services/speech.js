class SpeechService {
  constructor() {
    this.recognition = null;
    this.isRecording = false;
    this.finalTranscript = '';
    this.wordCount = 0;
    this.fillerWords = { total: 0, breakdown: {} };
    this.startTime = null;
    this.onInterim = null;
    this.onFinal = null;
    
    this.init();
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      
      this.recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const finalPart = event.results[i][0].transcript;
            this.finalTranscript += finalPart + ' ';
            this.processMetrics(finalPart);
            if (this.onFinal) this.onFinal(this.finalTranscript);
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (this.onInterim) this.onInterim(interim);
      };

      this.recognition.onerror = (e) => console.error('Speech error:', e);
      this.recognition.onend = () => {
        if (this.isRecording) {
          try { this.recognition.start(); } catch (e) {}
        }
      };
    }
  }

  start(onInterim, onFinal) {
    if (!this.recognition) return false;
    this.onInterim = onInterim;
    this.onFinal = onFinal;
    this.finalTranscript = '';
    this.wordCount = 0;
    this.fillerWords = { total: 0, breakdown: {} };
    this.startTime = Date.now();
    this.isRecording = true;
    this.recognition.start();
    return true;
  }

  stop() {
    this.isRecording = false;
    if (this.recognition) this.recognition.stop();
    const durationSec = (Date.now() - this.startTime) / 1000;
    const wpm = durationSec > 0 ? (this.wordCount / durationSec) * 60 : 0;
    
    return {
      transcript: this.finalTranscript.trim(),
      wordCount: this.wordCount,
      speakingDurationSeconds: durationSec,
      wpm: Math.round(wpm),
      fillerWords: this.fillerWords.breakdown,
      totalFillers: this.fillerWords.total
    };
  }

  processMetrics(text) {
    const words = text.trim().split(/\s+/);
    this.wordCount += words.length;

    const lower = text.toLowerCase();
    const fillers = ['um', 'uh', 'like', 'basically', 'actually', 'literally', 'you know'];
    
    fillers.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lower.match(regex);
      if (matches) {
        this.fillerWords.total += matches.length;
        this.fillerWords.breakdown[filler] = (this.fillerWords.breakdown[filler] || 0) + matches.length;
      }
    });
  }

  getWPM() {
    if (!this.startTime) return 0;
    const durationSec = (Date.now() - this.startTime) / 1000;
    return durationSec > 0 ? Math.round((this.wordCount / durationSec) * 60) : 0;
  }
}

window.SpeechService = SpeechService;
