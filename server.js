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
  console.error("❌ GOOGLE_API_KEY missing!");
} else {
  console.log("✅ GOOGLE_API_KEY loaded");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY?.trim());

// ======================
// Retry with longer backoff for 429
// ======================
async function withRetry(fn, maxRetries = 4) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.message?.includes("429")) {
        const delay = attempt * 3000; // 3s, 6s, 9s...
        console.warn(`⚠️ 429 Rate Limit - waiting ${delay/1000}s before retry ${attempt}/${maxRetries}`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

let model = null;

async function initializeModel() {
  // Try the best model first, then fallbacks
  const modelList = [
    'gemini-1.5-flash',      // ✅ Exists & works
  'gemini-1.5-pro',        // ✅ Exists but slower
  'gemini-pro' 
  ];

  for (const modelName of modelList) {
    try {
      console.log(`Trying model: ${modelName}`);
      const tempModel = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      });

      await tempModel.generateContent("Say OK");
      console.log(`🚀 SUCCESS: Using ${modelName}`);
      return tempModel;
    } catch (err) {
      console.warn(`⚠️ ${modelName} failed: ${err.message.substring(0, 100)}...`);
      if (err.message.includes("429")) {
        console.log("⏳ Quota hit. Waiting 10 seconds before next model...");
        await new Promise(r => setTimeout(r, 10000));
      }
    }
  }
  throw new Error("All models failed - quota or key issue.");
}

// Initialize
initializeModel()
  .then(m => { model = m; console.log("✅ Model ready!"); })
  .catch(err => console.error("❌", err.message));

// ======================
// Routes
// ======================
app.get("/api/health", (req, res) => res.json({ status: "ok", modelReady: !!model }));

app.get("/api/test-model", async (req, res) => {
  if (!model) return res.status(503).json({ error: "Model not ready. Wait or check quota." });
  try {
    const result = await withRetry(() => model.generateContent("Hello"));
    res.json({ success: true, response: result.response.text().trim() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.post("/api/question", async (req, res) => {
  if (!model) return res.status(503).json({ error: "Model is not ready" });

  const { type } = req.body;

  const prompts = {
    technical: `Generate ONE technical coding interview question suitable for a beginner to intermediate level engineer.

    Focus on: basic algorithms, fundamental data structures, JavaScript concepts, problem-solving patterns.
    Make it realistic but approachable for someone learning to code interview skills.
    
    Examples: reverse a string, find duplicates in array, simple sorting, basic recursion, etc.
    
    Return ONLY the question. No explanation, no hints, no solution.`,
    
    behavioral: `Generate ONE behavioral interview question suitable for a beginner software engineer or early-career professional.
    
    The question should encourage sharing real (or realistic) experiences using the STAR method (Situation, Task, Action, Result).
    
    Focus on: learning from mistakes, teamwork, handling feedback, taking initiative, problem-solving, or adapting to new situations.
    
    Make it approachable for someone early in their career.
    
    Return ONLY the question.`,
    
    "system-design": `Generate ONE beginner-friendly system design question for junior engineers learning system design concepts.
    
    Examples: Design a simple URL shortener, basic todo app, simple chat system, basic social media feed, etc.
    
    Focus on: breaking down the problem, basic scalability thinking, simple database design, basic caching concepts.
    
    Keep it approachable - not FAANG level complexity.
    
    Return ONLY the question.`
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
  if (!model) return res.status(503).json({ error: "Model is not ready" });

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




