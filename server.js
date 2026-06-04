const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_API_KEY is missing!");
} else {
  console.log("✅ GOOGLE_API_KEY loaded");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY?.trim());

// ======================
// Retry Helper
// ======================
async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isOverloaded = error.message?.includes("503") || 
                          error.message?.includes("high demand");

      if (isOverloaded && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // exponential backoff
        console.warn(`⚠️ Model overloaded. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// ======================
// Model Setup with Multiple Fallbacks
// ======================
let model = null;

async function initializeModel() {
  const modelList = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-pro",        // More stable, slightly slower
    "gemini-flash-latest"
  ];

  for (const modelName of modelList) {
    try {
      const tempModel = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 2048,
        }
      });

      // Test call
      await tempModel.generateContent("Test connection");
      console.log(`🚀 Successfully using: ${modelName}`);
      return tempModel;
    } catch (err) {
      console.warn(`⚠️ ${modelName} unavailable → trying next`);
    }
  }
  throw new Error("All Gemini models failed to initialize");
}

// Initialize model
initializeModel()
  .then(m => { model = m; })
  .catch(err => console.error("❌ Model init failed:", err.message));

// ======================
// Routes
// ======================

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", modelReady: !!model });
});

app.post("/api/question", async (req, res) => {
  if (!model) return res.status(503).json({ error: "AI model still initializing" });

  const { type } = req.body;

  const prompts = {
    technical: `Generate ONE challenging technical coding interview question suitable for mid-to-senior level engineers.

Focus on: algorithms, data structures, system optimization, JavaScript concepts, or problem-solving patterns.
Make it realistic for a real company interview (e.g. FAANG-level or strong startup).

Return ONLY the question. No explanation, no hints, no solution, no extra text.`,

    behavioral: `Generate ONE strong behavioral interview question for a mid-to-senior software engineer.

The question should encourage the candidate to share real experiences using the STAR method (Situation, Task, Action, Result).

Focus on: leadership, conflict resolution, failure, teamwork, handling pressure, mentoring, or difficult decisions.

Return ONLY the question.`,

    "system-design": `Generate ONE realistic system design interview question for mid-to-senior level engineers.

Examples: Design Instagram, TikTok, Uber, WhatsApp, Dropbox, a Rate Limiter, Notification System, etc.

Focus on scalability, trade-offs, high availability, databases, caching, APIs, and load balancing.

Return ONLY the question, nothing else.`
  };

  try {
    const prompt = prompts[type] || prompts.technical;

    const result = await withRetry(() => model.generateContent(prompt));
    
    res.json({ question: result.response.text().trim() });
  } catch (error) {
    console.error("Question Error:", error.message);
    res.status(500).json({ error: "Failed to generate question. Please try again later." });
  }
});

app.post("/api/feedback", async (req, res) => {
  if (!model) return res.status(503).json({ error: "AI model still initializing" });

  const { question, answer, type = "technical" } = req.body;

  if (!answer || answer.trim().length < 15) {
    return res.json({
      score: 20,
      feedback: "Answer too short. Give a full, structured response in real interviews."
    });
  }

  try {
    const prompt = `You are a strict senior interview coach...`; // (keep your original prompt here)

    const result = await withRetry(() => model.generateContent(prompt));
    const text = result.response.text();

    let score = 60;
    let feedback = "Feedback parsing failed.";

    const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
    if (scoreMatch) score = parseInt(scoreMatch[1]);

    const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]+)/i);
    if (feedbackMatch) feedback = feedbackMatch[1].trim();

    res.json({ score: Math.min(100, Math.max(0, score)), feedback });
  } catch (error) {
    console.error("Feedback Error:", error.message);
    res.status(500).json({ error: "Failed to generate feedback." });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, "build")));
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;