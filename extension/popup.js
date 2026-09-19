document.addEventListener('DOMContentLoaded', () => {
  const views = {
    setup: document.getElementById('setup-view'),
    recording: document.getElementById('recording-view'),
    loading: document.getElementById('loading-view'),
    result: document.getElementById('result-view')
  };

  const showView = (id) => {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[id].classList.add('active');
  };

  const speech = new window.SpeechService();
  let timerInterval = null;

  // Setup View
  document.getElementById('start-btn').addEventListener('click', async () => {
    try {
      // In extensions, getting mic permission inside popup is tricky. 
      // Sometimes it requires getUserMedia here to trigger prompt.
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      alert("Microphone access is required for voice interview analysis.");
      return;
    }

    const started = speech.start(
      (interim) => { document.getElementById('interim-transcript').innerText = interim; },
      (final) => { document.getElementById('final-transcript').innerText = final; }
    );

    if (!started) {
      alert("Speech recognition is unavailable in this browser.");
      return;
    }

    showView('recording');
    
    // Start Timer & Metrics update
    let startSecs = 0;
    timerInterval = setInterval(() => {
      startSecs++;
      const m = Math.floor(startSecs / 60).toString().padStart(2, '0');
      const s = (startSecs % 60).toString().padStart(2, '0');
      document.getElementById('timer').innerText = `${m}:${s}`;
      
      document.getElementById('wpm-display').innerText = speech.getWPM();
      document.getElementById('filler-display').innerText = speech.fillerWords.total;
    }, 1000);
  });

  // Recording View
  document.getElementById('finish-btn').addEventListener('click', async () => {
    clearInterval(timerInterval);
    const metrics = speech.stop();
    
    if (!metrics.transcript) {
      alert("No speech was detected. Please try the interview again.");
      showView('setup');
      return;
    }

    const role = document.getElementById('role-input').value || 'Backend Developer';
    
    const payload = {
      sessionId: 'ext-' + Date.now(),
      role: role,
      ...metrics
    };

    showView('loading');

    try {
      const result = await window.ApiService.evaluateInterview(payload);
      
      document.getElementById('overall-score').innerText = result.overallScore || '--';
      document.getElementById('res-wpm').innerText = result.fillerWordCount !== undefined ? metrics.wpm : '--';
      document.getElementById('res-fillers').innerText = result.fillerWordCount || 0;
      
      const strengthsUl = document.getElementById('res-strengths');
      strengthsUl.innerHTML = '';
      (result.strengths || []).forEach(s => {
        const li = document.createElement('li');
        li.innerText = s;
        strengthsUl.appendChild(li);
      });

      const improvementsUl = document.getElementById('res-improvements');
      improvementsUl.innerHTML = '';
      (result.improvements || []).forEach(s => {
        const li = document.createElement('li');
        li.innerText = s;
        improvementsUl.appendChild(li);
      });

      showView('result');
    } catch (e) {
      alert("PARICHAYA could not connect to the interview analysis service.");
      showView('setup');
    }
  });

  // Result View
  document.getElementById('open-app-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/interview' });
  });
});
