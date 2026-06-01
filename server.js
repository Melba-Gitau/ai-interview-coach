const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GOOGLE_API_KEY) {
  console.warn("Missing GOOGLE_API_KEY - API calls will fail");
}

const apiKey = process.env.GOOGLE_API_KEY?.trim();
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Generate interview question based on type
app.post("/api/question", async (req, res) => {
  const { type } = req.body;

  const prompts = {
    technical:
      "Generate a single realistic technical interview question about system design or coding. Make it specific and challenging. Just the question, nothing else.",
    behavioral:
      "Generate a single behavioral interview question using the STAR format (Situation, Task, Action, Result). Ask about a challenging situation or conflict. Just the question, nothing else.",
    "system-design":
      "Generate a single system design interview question about building a scalable service (e.g., database, cache, API, messaging queue). Be specific. Just the question, nothing else.",
  };

  try {
    const prompt = prompts[type] || prompts.technical;
    const result = await model.generateContent(prompt);
    const question = result.response.text();
    res.json({ question });
  } catch (error) {
    console.error("Question error:", error.message || error);
    const message = error.message?.includes("429")
      ? "Gemini API quota exceeded. Wait a minute or try another model in server.js."
      : "Failed to generate question";
    res.status(500).json({ error: message });
  }
});

// Get feedback on answer
app.post("/api/feedback", async (req, res) => {
  const { question, answer, type = "technical" } = req.body;

  const feedbackPrompt = `
You are an expert interview coach. Evaluate this ${type} interview answer.

Question: ${question}

Answer: ${answer}

Provide concise, actionable feedback on:
1. Clarity - How clear was the explanation?
2. Structure - Was the answer well-organized?
3. ${type === "behavioral" ? "Specific Example" : "Technical Depth"} - Was it detailed enough?
4. Communication - How well did they articulate their thinking?

Format: Bullet points, max 4-5 sentences total.
`;

  try {
    const result = await model.generateContent(feedbackPrompt);
    const feedback = result.response.text();
    res.json({ feedback });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
  console.log(`Server running on ${PORT}`);
});
