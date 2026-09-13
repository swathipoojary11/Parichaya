/**
 * Ollama Local AI Client Module
 * Connects directly to local Ollama daemon at http://127.0.0.1:11434
 * Model: qwen2.5:3b
 */

const OLLAMA_ENDPOINT = "http://127.0.0.1:11434/api/generate";
const DEFAULT_MODEL = "qwen2.5:3b";

/**
 * Verifies connectivity to the local Ollama service.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function checkOllamaHealth() {
  try {
    const res = await fetch("http://127.0.0.1:11434/api/tags", {
      method: "GET"
    });
    if (!res.ok) {
      return { ok: false, error: `Ollama returned HTTP status ${res.status}` };
    }
    const data = await res.json();
    const models = data.models || [];
    const hasQwen = models.some(m => m.name.includes("qwen2.5"));
    return { ok: true, models, hasQwen };
  } catch (err) {
    return { ok: false, error: "Ollama daemon unreachable at 127.0.0.1:11434" };
  }
}

/**
 * Executes a single-purpose prompt against local Qwen2.5 3B model.
 * Requests structured JSON output.
 * @param {string} prompt - The structured input prompt.
 * @param {string} [systemMessage] - System instructions.
 * @returns {Promise<Object>} - Parsed JSON response object.
 */
export async function generateStructuredJSON(prompt, systemMessage = "") {
  try {
    const payload = {
      model: DEFAULT_MODEL,
      prompt: prompt,
      system: systemMessage + "\nReturn ONLY valid JSON. No markdown code blocks, no intro, no conversational text.",
      stream: false,
      options: {
        num_ctx: 2048,
        temperature: 0.2
      }
    };

    const res = await fetch(OLLAMA_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const rawResponse = data.response.trim();

    // Clean JSON markdown wrapper if model output includes it
    const cleanJSON = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJSON);
  } catch (err) {
    console.error("Ollama Generation Failed:", err);
    throw err;
  }
}
