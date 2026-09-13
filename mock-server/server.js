/**
 * Minimal, dependency-free mock of POST /api/evaluate-interview
 * Run:  node server.js
 * Listens on http://localhost:3000
 *
 * This exists purely so Member 3's extension has a real endpoint to
 * dispatch the transcript payload to while the rest of the backend
 * is being built by other members. Swap this out once the real
 * evaluation service exists.
 */
const http = require("http");

const server = http.createServer((req, res) => {
  // CORS: the request comes from a chrome-extension:// page context.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "POST" && req.url === "/api/evaluate-interview") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let payload;
      try {
        payload = JSON.parse(body);
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      console.log("\n--- Interview session received ---");
      console.log(`Duration:   ${payload.durationSeconds}s`);
      console.log(`Avg WPM:    ${payload.averageWpm}`);
      console.log(`Fillers:    ${payload.fillerTotal}`);
      console.log(`Confidence: ${payload.confidenceScore}`);
      console.log("-----------------------------------\n");

      const feedback =
        payload.confidenceScore >= 75
          ? "Strong pacing and minimal filler words. Keep this up."
          : payload.confidenceScore >= 45
          ? "Decent answer — watch your pace and trim filler words next round."
          : "Slow down, pause instead of using filler words, and try again.";

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ received: true, feedback }));
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, () => {
  console.log("Mock evaluator listening on http://localhost:3000");
});
