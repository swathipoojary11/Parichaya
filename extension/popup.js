/* ============================================================
   Parichaya — Interview Coach
   Member 3: Audio Engineer & Chrome Extension Specialist
   Manifest V3 popup + Web Speech Audio Pipeline
   ============================================================ */

const EVALUATE_ENDPOINT = "http://localhost:3000/api/evaluate-interview";

const FILLER_WORDS = ["um", "uh", "like", "you know", "so", "actually", "basically", "literally"];

// ---------- DOM ----------
const orb = document.getElementById("orb");
const statusText = document.getElementById("statusText");
const timerEl = document.getElementById("timer");
const transcriptEl = document.getElementById("transcript");
const wpmValueEl = document.getElementById("wpmValue");
const wpmZoneLabelEl = document.getElementById("wpmZoneLabel");
const fillerTotalEl = document.getElementById("fillerTotal");
const wordCountEl = document.getElementById("wordCount");
const fillerChipsEl = document.getElementById("fillerChips");
const confidenceValueEl = document.getElementById("confidenceValue");
const confidenceRing = document.getElementById("confidenceRing");
const toggleBtn = document.getElementById("toggleBtn");
const finishBtn = document.getElementById("finishBtn");
const exportBtn = document.getElementById("exportBtn");
const historyBtn = document.getElementById("historyBtn");
const historyClose = document.getElementById("historyClose");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const waveCanvas = document.getElementById("wave");
const waveCtx = waveCanvas.getContext("2d");

// ---------- State ----------
let recognition = null;
let isRecording = false;
let startedAt = null;
let timerInterval = null;
let audioCtx = null;
let analyser = null;
let micStream = null;
let rafId = null;

let finalTranscript = "";
let totalWords = 0;
let fillerCounts = {};
let lastSpeechAt = null;
let longPauseCount = 0;
let lastFinalStats = null;

// ---------- Helpers ----------
function fmtTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

function currentElapsedSeconds() {
  return startedAt ? (Date.now() - startedAt) / 1000 : 0;
}

function currentWpm() {
  const minutes = currentElapsedSeconds() / 60;
  if (minutes <= 0) return 0;
  return Math.round(totalWords / minutes);
}

function wpmZone(wpm) {
  if (wpm === 0) return { label: "words / min", color: "var(--muted)" };
  if (wpm < 110) return { label: "a little slow — add energy", color: "var(--coral)" };
  if (wpm <= 160) return { label: "great pace", color: "var(--teal)" };
  return { label: "a little fast — take a breath", color: "var(--coral)" };
}

function totalFillers() {
  return Object.values(fillerCounts).reduce((a, b) => a + b, 0);
}

// Unique composite score: rewards steady pace, penalizes filler density and long silences.
function computeConfidenceScore() {
  const wpm = currentWpm();
  let score = 100;

  // Pace penalty: distance from the 110-160 "optimal" band
  if (wpm > 0) {
    const distance = wpm < 110 ? 110 - wpm : wpm > 160 ? wpm - 160 : 0;
    score -= Math.min(30, distance * 0.4);
  }

  // Filler penalty: ratio of filler words to total words
  const fillerRatio = totalWords > 0 ? totalFillers() / totalWords : 0;
  score -= Math.min(40, fillerRatio * 250);

  // Long-pause penalty (dead air > 3s between finalized phrases)
  score -= Math.min(20, longPauseCount * 4);

  return Math.max(0, Math.round(score));
}

function updateConfidenceRing(score) {
  const circumference = 327; // 2 * PI * r(52), matches CSS dasharray
  const offset = circumference - (circumference * score) / 100;
  confidenceRing.style.strokeDashoffset = offset;
  confidenceRing.style.stroke =
    score >= 75 ? "var(--teal)" : score >= 45 ? "var(--amber)" : "var(--coral)";
  confidenceValueEl.textContent = score;
}

function renderFillerChips() {
  fillerChipsEl.innerHTML = "";
  const entries = FILLER_WORDS.filter((w) => fillerCounts[w]);
  if (entries.length === 0) {
    fillerChipsEl.innerHTML = `<span class="placeholder">None detected yet — nice.</span>`;
    return;
  }
  for (const word of entries) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `${word} <strong>${fillerCounts[word]}</strong>`;
    fillerChipsEl.appendChild(chip);
  }
}

function highlightTranscript(text) {
  let html = text.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  for (const word of FILLER_WORDS) {
    const re = new RegExp(`\\b(${word})\\b`, "gi");
    html = html.replace(re, `<span class="filler">$1</span>`);
  }
  return html;
}

function refreshStatsUI() {
  const wpm = currentWpm();
  const zone = wpmZone(wpm);
  wpmValueEl.textContent = wpm;
  wpmZoneLabelEl.textContent = zone.label;
  wpmZoneLabelEl.style.color = zone.color;

  fillerTotalEl.textContent = totalFillers();
  wordCountEl.textContent = totalWords;

  const score = computeConfidenceScore();
  updateConfidenceRing(score);
  renderFillerChips();

  // Tell the service worker to reflect live WPM on the toolbar badge.
  chrome.runtime.sendMessage({
    type: "WPM_UPDATE",
    wpm,
    zone: wpm === 0 ? "idle" : wpm < 110 || wpm > 160 ? "warn" : "good",
  });
}

// ---------- Speech recognition ----------
function buildRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    statusText.textContent = "Speech recognition not supported in this browser";
    return null;
  }
  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";

  rec.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const chunk = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        // Track long pauses between finalized phrases (dead air).
        if (lastSpeechAt && Date.now() - lastSpeechAt > 3000) longPauseCount++;
        lastSpeechAt = Date.now();

        finalTranscript += chunk + " ";
        const words = chunk.trim().split(/\s+/).filter(Boolean);
        totalWords += words.length;

        const lower = chunk.toLowerCase();
        for (const fw of FILLER_WORDS) {
          const matches = lower.match(new RegExp(`\\b${fw}\\b`, "g"));
          if (matches) fillerCounts[fw] = (fillerCounts[fw] || 0) + matches.length;
        }
      } else {
        interim += chunk;
      }
    }
    transcriptEl.innerHTML = highlightTranscript(finalTranscript) + `<span class="placeholder">${interim}</span>`;
    transcriptEl.scrollTop = transcriptEl.scrollHeight;
    refreshStatsUI();
  };

  rec.onerror = (e) => {
    statusText.textContent = `Mic error: ${e.error}`;
  };

  rec.onend = () => {
    if (isRecording) rec.start(); // auto-restart (Chrome stops after ~60s of silence)
  };

  return rec;
}

// ---------- Waveform (Web Audio pipeline) ----------
async function startWaveform() {
  micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(micStream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  drawWaveform();
}

function drawWaveform() {
  const bufferLength = analyser.frequencyBinCount;
  const data = new Uint8Array(bufferLength);
  const w = waveCanvas.width = waveCanvas.clientWidth;
  const h = waveCanvas.height;

  function frame() {
    rafId = requestAnimationFrame(frame);
    analyser.getByteFrequencyData(data);
    waveCtx.clearRect(0, 0, w, h);
    const barWidth = (w / bufferLength) * 2.2;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (data[i] / 255) * h;
      waveCtx.fillStyle = "#e8a33d";
      waveCtx.fillRect(x, h - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }
  }
  frame();
}

function stopWaveform() {
  if (rafId) cancelAnimationFrame(rafId);
  if (micStream) micStream.getTracks().forEach((t) => t.stop());
  if (audioCtx) audioCtx.close();
  waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
}

// ---------- Start / stop ----------
async function startSession() {
  finalTranscript = "";
  totalWords = 0;
  fillerCounts = {};
  longPauseCount = 0;
  lastSpeechAt = null;
  transcriptEl.innerHTML = "";
  startedAt = Date.now();
  lastFinalStats = null;

  try {
    await startWaveform();
  } catch (err) {
    statusText.textContent = "Microphone permission denied";
    return;
  }

  recognition = buildRecognition();
  if (!recognition) return;
  recognition.start();

  isRecording = true;
  orb.classList.add("live");
  statusText.textContent = "Recording";
  toggleBtn.textContent = "Stop";
  toggleBtn.classList.add("recording");
  finishBtn.disabled = false;
  exportBtn.disabled = true;

  timerInterval = setInterval(() => {
    timerEl.textContent = fmtTime(currentElapsedSeconds());
    refreshStatsUI();
  }, 1000);
}

function stopSession({ silent } = {}) {
  isRecording = false;
  if (recognition) {
    recognition.onend = null;
    recognition.stop();
  }
  stopWaveform();
  clearInterval(timerInterval);
  orb.classList.remove("live");
  toggleBtn.textContent = "Start";
  toggleBtn.classList.remove("recording");
  if (!silent) statusText.textContent = "Stopped";
}

function buildSessionPayload() {
  const durationSeconds = Math.round(currentElapsedSeconds());
  return {
    transcript: finalTranscript.trim(),
    durationSeconds,
    wordCount: totalWords,
    averageWpm: currentWpm(),
    fillerCounts,
    fillerTotal: totalFillers(),
    longPauseCount,
    confidenceScore: computeConfidenceScore(),
    timestamp: new Date().toISOString(),
  };
}

async function finishInterview() {
  finishBtn.disabled = true;
  statusText.textContent = "Sending to evaluator…";
  stopSession({ silent: true });

  const payload = buildSessionPayload();
  lastFinalStats = payload;

  try {
    const res = await fetch(EVALUATE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      statusText.textContent = "Evaluated ✓ saved locally";
    } else {
      statusText.textContent = `Evaluator responded ${res.status} — saved locally`;
    }
  } catch (err) {
    statusText.textContent = "Evaluator offline — saved locally only";
  }

  await saveSessionToHistory(payload);
  exportBtn.disabled = false;
}

// ---------- Local history (zero-cloud fallback) ----------
async function saveSessionToHistory(payload) {
  const { sessions = [] } = await chrome.storage.local.get("sessions");
  sessions.unshift(payload);
  await chrome.storage.local.set({ sessions: sessions.slice(0, 25) });
  renderHistory(sessions);
}

async function renderHistory(preloaded) {
  const sessions = preloaded || (await chrome.storage.local.get("sessions")).sessions || [];
  if (sessions.length === 0) {
    historyList.innerHTML = `<span class="placeholder">No sessions saved yet.</span>`;
    return;
  }
  historyList.innerHTML = sessions
    .map(
      (s) => `
      <div class="historyItem">
        <div class="historyTop">
          <span>${new Date(s.timestamp).toLocaleString()}</span>
          <span>${fmtTime(s.durationSeconds)}</span>
        </div>
        <div>WPM ${s.averageWpm} · fillers ${s.fillerTotal} · confidence ${s.confidenceScore}</div>
      </div>`
    )
    .join("");
}

function exportSession() {
  if (!lastFinalStats) return;
  const blob = new Blob([JSON.stringify(lastFinalStats, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url,
    filename: `interview-session-${Date.now()}.json`,
    saveAs: true,
  });
}

// ---------- Wiring ----------
toggleBtn.addEventListener("click", () => {
  if (isRecording) stopSession();
  else startSession();
});

finishBtn.addEventListener("click", finishInterview);
exportBtn.addEventListener("click", exportSession);

historyBtn.addEventListener("click", () => {
  historyPanel.classList.remove("hidden");
  renderHistory();
});
historyClose.addEventListener("click", () => historyPanel.classList.add("hidden"));

// Initial paint
refreshStatsUI();
renderHistory();
