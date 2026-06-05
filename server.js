const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const { Groq } = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

console.log("✅ GROQ_API_KEY loaded:", !!process.env.GROQ_API_KEY);
console.log("✅ GOOGLE_API_KEY loaded:", !!process.env.GOOGLE_API_KEY);

// ======================
// Initialize Clients
// ======================
const groq = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY }) 
  : null;

const genAI = process.env.GOOGLE_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY?.trim()) 
  : null;

let currentProvider = null; // "groq" or "gemini"

// ======================
// Unified AI Call Function
// ======================
async function callAI(prompt, type = "question") {
  // Try Groq first (faster + better free limits)
  if (groq) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",     // Excellent balance
        temperature: type === "feedback" ? 0.6 : 0.8,
        max_tokens: type === "feedback" ? 800 : 600,
      });

      currentProvider = "groq";
      return completion.choices[0].message.content.trim();
    } catch (err) {
      console.warn("⚠️ Groq failed, trying Gemini fallback...", err.message?.substring(0, 100));
    }
  }

  // Fallback to Gemini
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3.5-flash",
        generationConfig: { temperature: type === "feedback" ? 0.6 : 0.8, maxOutputTokens: 2048 }
      });

      const result = await model.generateContent(prompt);
      currentProvider = "gemini";
      return result.response.text().trim();
    } catch (err) {
      console.error("❌ Gemini also failed:", err.message);
      throw err;
    }
  }

  throw new Error("No AI provider available");
}

// ======================
// Routes
// ======================

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    provider: currentProvider || "none",
    groqReady: !!groq,
    geminiReady: !!genAI 
  });
});

app.get("/api/test-ai", async (req, res) => {
  try {
    const text = await callAI("Say hello in one short sentence.");
    res.json({ success: true, provider: currentProvider, response: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Generate Question
app.post("/api/question", async (req, res) => {
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
    const question = await callAI(prompt, "question");
    res.json({ question, provider: currentProvider });
  } catch (error) {
    console.error("Question Error:", error.message);
    res.status(500).json({ error: "Failed to generate question. Please try again." });
  }
});

// Feedback
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

// Serve React frontend
app.use(express.static(path.join(__dirname, "build")));
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Groq + Gemini dual mode active`);
});

module.exports = app;