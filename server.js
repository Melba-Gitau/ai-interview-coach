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

// Initialize AI
if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_API_KEY is missing!");
} else {
  console.log("✅ GOOGLE_API_KEY loaded successfully");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY?.trim());
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ======================
// API ROUTES
// ======================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/question", async (req, res) => {
  console.log("📥 /api/question called with:", req.body);
  const { type } = req.body;

  if (!type) {
    return res.status(400).json({ error: "Type is required" });
  }

  const prompts = {
    technical: "Generate a single realistic technical interview question about system design or coding. Make it specific and challenging. Just the question, nothing else.",
    behavioral: "Generate a single behavioral interview question using the STAR format. Just the question, nothing else.",
    "system-design": "Generate a single system design interview question about building a scalable service. Be specific. Just the question, nothing else.",
  };

  try {
    const prompt = prompts[type] || prompts.technical;
    const result = await model.generateContent(prompt);
    res.json({ question: result.response.text() });
  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ error: "Failed to generate question. Please try again." });
  }
});

app.post("/api/feedback", async (req, res) => {
  const { question, answer, type = "technical" } = req.body;

  const feedbackPrompt = `Evaluate this ${type} interview answer. Question: ${question} Answer: ${answer}. Give short, actionable bullet point feedback.`;

  try {
    const result = await model.generateContent(feedbackPrompt);
    res.json({ feedback: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

// ======================
// Serve React App - LAST
// ======================
app.use(express.static(path.join(__dirname, "build")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;   // Required for Vercel