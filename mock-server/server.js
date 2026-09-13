/**
 * Local WebSocket Telemetry Server for Video/Voice Mock Interview Arena
 * Runs on port 3001
 * Tracks real-time WPM pacing and counts filler words.
 */

const { WebSocketServer } = require("ws");

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

console.log(`[AURA Telemetry] WebSocket server listening on ws://127.0.0.1:${PORT}`);

const FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "actually", "right", "honestly"];

wss.on("connection", (ws) => {
  console.log("[AURA Telemetry] Client connected to video/voice telemetry stream.");

  let wordHistory = [];
  let startTime = Date.now();
  let fillerWordCounts = {};
  FILLER_WORDS.forEach(w => fillerWordCounts[w] = 0);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "reset") {
        wordHistory = [];
        startTime = Date.now();
        FILLER_WORDS.forEach(w => fillerWordCounts[w] = 0);
        return;
      }

      if (data.type === "transcript_chunk" && data.text) {
        const text = data.text.trim();
        const words = text.toLowerCase().split(/\s+/).filter(Boolean);
        const now = Date.now();
        const elapsedMinutes = (now - startTime) / 60000;

        // Count filler words
        words.forEach(word => {
          const cleanWord = word.replace(/[^a-z]/g, "");
          if (FILLER_WORDS.includes(cleanWord)) {
            fillerWordCounts[cleanWord] = (fillerWordCounts[cleanWord] || 0) + 1;
          }
        });

        wordHistory.push(...words);
        const totalWords = wordHistory.length;
        const currentWpm = elapsedMinutes > 0 ? Math.round(totalWords / elapsedMinutes) : 140;
        const totalFillers = Object.values(fillerWordCounts).reduce((a, b) => a + b, 0);

        // Send telemetry update to client
        ws.send(JSON.stringify({
          type: "telemetry_update",
          wpm: currentWpm,
          totalWords,
          totalFillers,
          fillerWordCounts,
          latestTranscript: text,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error("[AURA Telemetry] Error processing socket message:", err);
    }
  });

  ws.on("close", () => {
    console.log("[AURA Telemetry] Client disconnected.");
  });
});
