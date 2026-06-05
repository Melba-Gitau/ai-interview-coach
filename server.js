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
// Feedback - Structured Scoring (Best Version)
app.post("/api/feedback", async (req, res) => {
  const { question, answer, type = "technical" } = req.body;

  const trimmedAnswer = (answer || "").trim();

  if (!trimmedAnswer || trimmedAnswer.length < 20) {
    return res.json({
      score: 8,
      feedback: "Very poor effort. Short or refusing answers are not acceptable in real interviews.",
      criteria: {
        understanding: 1,
        approach: 1,
        depth: 1,
        communication: 1
      },
      provider: currentProvider
    });
  }

  try {
    const prompt = `You are a strict FAANG senior interviewer.

Question: ${question}

Answer: ${trimmedAnswer}

Evaluate this ${type} answer and return a **structured JSON** response.

Scoring criteria (0-10 for each):

${type === "technical" ? 
`{
  "understanding": "How well they understood the problem",
  "approach": "Quality of solution approach",
  "depth": "Technical depth and edge cases",
  "communication": "Clarity and structure of explanation"
}` : type === "behavioral" ? 
`{
  "situation": "Clear STAR structure (Situation & Task)",
  "action": "Specific actions taken",
  "result": "Measurable results & lessons learned",
  "communication": "Storytelling quality"
}` : 
`{
  "requirements": "Understanding requirements & constraints",
  "architecture": "High-level design quality",
  "scalability": "Scalability, reliability, trade-offs",
  "communication": "Clarity of explanation"
}`}

Be strict.

Respond with **valid JSON only** in this exact format:

{
  "overallScore": 65,
  "feedback": "2-4 sentences of honest feedback...",
  "criteria": {
    "understanding": 7,
    "approach": 6,
    ...
  }
}`;

    const responseText = await callAI(prompt, "feedback");

    // Parse JSON from AI response
    let parsed;
    try {
      // Extract JSON if AI added extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      parsed = JSON.parse(jsonString);
    } catch (e) {
      // Fallback if parsing fails
      parsed = {
        overallScore: 50,
        feedback: responseText.substring(0, 300),
        criteria: { understanding: 5, approach: 5, depth: 5, communication: 5 }
      };
    }

    res.json({
      score: Math.max(0, Math.min(100, parsed.overallScore || 50)),
      feedback: parsed.feedback || "No feedback generated.",
      criteria: parsed.criteria || {},
      provider: currentProvider
    });

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