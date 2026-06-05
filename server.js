const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // Update to your domain in production
app.use(express.json());

const PORT = process.env.PORT || 8080;

if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_API_KEY is missing in .env file!");
} else {
  console.log("✅ GOOGLE_API_KEY loaded");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY?.trim());

// ======================
// Retry Helper (handles 503 overload)
// ======================
async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isOverload = error.message?.includes("503") || 
                        error.message?.includes("high demand") ||
                        error.message?.includes("overloaded");

      if (isOverload && attempt < maxRetries) {
        const delay = attempt * 1500;
        console.warn(`⚠️ Overloaded (attempt ${attempt}). Waiting ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw error;
      }
    }
  }
}

// ======================
// Model Initialization (June 2026)
// ======================
let model = null;

async function initializeModel() {
  const modelList = [
    "gemini-3.5-flash",           // Best current model
    "gemini-3.1-flash-lite",      // Fast & cheap fallback
    "gemini-3-flash-preview",     // Preview version
    "gemini-flash-latest"         // Dynamic latest alias
  ];

  for (const modelName of modelList) {
    try {
      console.log(`Trying model: ${modelName}...`);
      
      const tempModel = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      // Quick connectivity test
      const testResult = await tempModel.generateContent("Respond with only the word: OK");
      if (testResult.response.text().trim()) {
        console.log(`🚀 SUCCESS: Using ${modelName}`);
        return tempModel;
      }
    } catch (err) {
      console.warn(`⚠️ ${modelName} failed: ${err.message?.substring(0, 120)}...`);
    }
  }

  throw new Error("All models failed. Check API key / billing / region.");
}

// Initialize model on startup
initializeModel()
  .then(m => {
    model = m;
    console.log("✅ Model is ready for requests!");
  })
  .catch(err => {
    console.error("❌ CRITICAL:", err.message);
    console.log("\n💡 FIX SUGGESTIONS:");
    console.log("1. Create a NEW API key at https://aistudio.google.com/app/apikey");
    console.log("2. Enable billing in Google Cloud Console");
    console.log("3. Test your key directly in Google AI Studio");
  });

// ======================
// Routes
// ======================

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    modelReady: !!model,
    timestamp: new Date().toISOString()
  });
});

// Test model endpoint (very useful for debugging)
app.get("/api/test-model", async (req, res) => {
  if (!model) {
    return res.status(503).json({ error: "Model not initialized yet" });
  }
  try {
    const result = await model.generateContent("Say hello in one short sentence.");
    res.json({ 
      success: true, 
      model: model.modelName || "unknown",
      response: result.response.text().trim() 
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Generate Question
app.post("/api/question", async (req, res) => {
  if (!model) return res.status(503).json({ error: "Model still initializing. Try again shortly." });

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
    res.status(500).json({ error: "Failed to generate question. Please try again." });
  }
});

// Feedback
app.post("/api/feedback", async (req, res) => {
  if (!model) return res.status(503).json({ error: "Model still initializing." });

  const { question, answer, type = "technical" } = req.body;

  if (!answer || answer.trim().length < 15) {
    return res.json({
      score: 20,
      feedback: "Answer is too short. In real interviews, always provide a structured, detailed response."
    });
  }

  try {
    const prompt = `You are a strict, honest senior engineering interviewer.

Question: ${question}

Answer: ${answer}

Score this ${type} answer harshly (0-100) using this format exactly:

SCORE: [number]
FEEDBACK: [2-4 sentences of honest constructive feedback. Point out weaknesses clearly.]`;

    const result = await withRetry(() => model.generateContent(prompt));
    const text = result.response.text();

    let score = 55;
    let feedback = "Could not parse feedback.";

    const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
    if (scoreMatch) score = parseInt(scoreMatch[1]);

    const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]+)/i);
    if (feedbackMatch) feedback = feedbackMatch[1].trim();

    res.json({ 
      score: Math.max(0, Math.min(100, score)), 
      feedback 
    });
  } catch (error) {
    console.error("Feedback Error:", error.message);
    res.status(500).json({ error: "Failed to generate feedback." });
  }
});

// Serve React app (must be last)
app.use(express.static(path.join(__dirname, "build")));
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;