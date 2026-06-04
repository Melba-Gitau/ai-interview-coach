const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Anthropic = require("@anthropic-ai/sdk");

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

// ============== CONFIGURATION ==============
const PRIMARY_PROVIDER = "gemini";      
const FALLBACK_PROVIDER = "claude";

// Initialize Clients
const geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY?.trim());
const claudeClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Choose model
const GEMINI_MODEL = "gemini-1.5-flash";
const CLAUDE_MODEL = "claude-3-5-sonnet-20240620";  

// Helper function to call AI with fallback
async function generateContent(prompt, provider = PRIMARY_PROVIDER) {
  let lastError = null;

  // Try primary provider first
  if (provider === "gemini" || PRIMARY_PROVIDER === "gemini") {
    try {
      console.log("🤖 Using Gemini(Primary)");
      const message = await claudeClient.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 800,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }]
      });
      return message.content[0].text;
    } catch (error) {
      console.error("Claude Error:", error.message);
      lastError = error;
    }
  }

  // Try Gemini (fallback)
  try {
    console.log("🤖 Using Gemini (Fallback)");
    const model = geminiClient.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error.message);
    lastError = error;
  }

  throw lastError || new Error("Both AI providers failed");
}

// ======================
// API ROUTES
// ======================

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    primary: PRIMARY_PROVIDER,
    message: "AI Interview Coach Backend Running" 
  });
});

// Generate Question
app.post("/api/question", async (req, res) => {
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
    const question = await generateContent(prompt);
    res.json({ question });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate question" });
  }
});

// Feedback - Strict Evaluation
app.post("/api/feedback", async (req, res) => {
  const { question, answer, type = "technical" } = req.body;

  if (!answer || answer.trim().length < 10) {
    return res.json({
      score: 15,
      feedback: "Your answer is too short or empty. Always provide a proper response in interviews."
    });
  }

  const prompt = `You are a strict, honest, and tough senior interview coach.

Evaluate this ${type} interview answer critically.

Question: ${question}

Answer: ${answer}

Scoring (be harsh):
- 0-30: Poor / refusal / very short
- 31-50: Weak, vague
- 51-65: Average
- 66-80: Good
- 81-95: Strong
- 96-100: Exceptional

Respond in exact format:

SCORE: [number]
FEEDBACK: [2-4 sentences of honest feedback]`;

  try {
    const text = await generateContent(prompt);
    
    let score = 60;
    let feedback = text;

    const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
    if (scoreMatch) score = Math.max(0, Math.min(100, parseInt(scoreMatch[1])));

    const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]+)/i);
    if (feedbackMatch) feedback = feedbackMatch[1].trim();

    res.json({ score, feedback });
  } catch (error) {
    console.error("Feedback Error:", error.message);
    res.status(500).json({ error: "Failed to generate feedback. Please try again." });
  }
});

// ======================
// Serve React App
// ======================
app.use(express.static(path.join(__dirname, "build")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Primary AI: ${PRIMARY_PROVIDER.toUpperCase()}`);
});

module.exports = app;