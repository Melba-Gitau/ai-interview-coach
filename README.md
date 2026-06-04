# ThinkHire AI — The AI Interview Coach

Practice how you **think**, not just how you code.

![ThinkHire AI](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Gemini API](https://img.shields.io/badge/Gemini%20API-v1-orange)
![License](https://img.shields.io/badge/license-MIT-green)

**🌐 Live Demo:** [https://thinkhire-ai.vercel.app](https://thinkhire-ai.vercel.app)

---

## 🎯 What is ThinkHire AI?

An AI-powered interview coach that helps developers practice articulating their technical reasoning, behavioral storytelling, and problem-solving process.

**The Problem:** Many developers don't fail interviews because they can't code — they struggle because they can't *clearly explain* how they think.

**The Solution:** ThinkHire AI gives you instant AI feedback on clarity, structure, reasoning, and communication.

---

## ✨ Features

- 🤖 **AI Mock Interviews** — Realistic technical, behavioral, and system design rounds powered by Google Gemini
- 💭 **Dynamic Questions** — AI-generated questions for unlimited practice
- 📊 **Real-time Feedback** — Get scored on clarity, structure, reasoning, and communication
- 🎯 **Multiple Interview Types** — Technical, Behavioral, System Design
- 💾 **Save & Review** — Keep track of your practice sessions and review feedback anytime
- ⚡ **Fast & Free** — Built with React, Express, and Google's Gemini API
- 🎨 **Beautiful UI** — Modern design with Space Grotesk + Inter fonts

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Lucide Icons
- Space Grotesk + Inter fonts

**Backend:**
- Node.js + Express
- Google Generative AI (Gemini 2.0 Flash)
- CORS enabled

**Deployment:**
- Frontend: Vercel
- Backend: Railway
- Environment: Node.js 18+

---

## 🚀 Quick Start

### Try the Live App (Easiest) ⭐

👉 **[Open ThinkHire AI](https://thinkhire-ai.vercel.app)**

Just click and start practicing! No signup required.

---

### Run Locally (For Developers)

**Prerequisites:**
- Node.js 18+
- npm or yarn
- Google API Key (free from [ai.google.dev](https://ai.google.dev))

**Setup:**

1. **Clone the repository**
```bash
   git clone https://github.com/melba-magiri/ai-interview-coach.git
   cd ai-interview-coach
```

2. **Install dependencies**
```bash
   npm install
```

3. **Create `.env` file in project root**

4. **Start the backend** (Terminal 1)
```bash
   npm run server
```
   You should see: `Server running on port 5000`

5. **Start the frontend** (Terminal 2)
```bash
   npm start
```
   Opens http://localhost:3000 automatically

6. **Start practicing!** 🎉
   - Click "Get Started"
   - Choose an interview type
   - Answer questions and get AI feedback

---

## 💡 How to Use

### Step 1: Choose Your Interview Type
- 🔧 **Technical** — Coding problems, algorithms, system concepts
- 🤝 **Behavioral** — STAR-format story questions
- 🏗️ **System Design** — Architecture & scalability questions

### Step 2: Answer the Question
Think out loud and articulate your reasoning. No time limits — just practice.

### Step 3: Get AI Feedback
Receive instant coaching on:
- **Clarity** — How well you explained your thinking
- **Structure** — Organization of your answer
- **Technical Reasoning** — Depth and correctness
- **Communication** — How you articulated ideas

### Step 4: Review & Learn
Save sessions to "My Responses" and review your progress anytime.

---

## 📝 API Endpoints

### `POST /api/question`
Generate a new interview question

**Request:**
```json
{ "type": "technical" }
```

**Response:**
```json
{ "question": "Reverse a string without using built-in methods..." }
```

---

### `POST /api/feedback`
Get AI feedback on an answer

**Request:**
```json
{
  "question": "Reverse a string...",
  "answer": "I would iterate through...",
  "type": "technical"
}
```

**Response:**
```json
{
  "feedback": "Clarity: Good explanation...",
  "score": 78
}
```

---

## 🗺️ Roadmap

- [x] Core interview chat interface
- [x] Dynamic question generation
- [x] Real-time AI feedback
- [x] Multiple interview types
- [x] Save & review sessions
- [ ] Domain-specific questions (Frontend, Backend, DevOps)
- [ ] Interview history & progress analytics
- [ ] Story Builder tool
- [ ] Custom question sets
- [ ] User authentication

---

## 🤝 Contributing

Found a bug? Have an idea? Feel free to:
- Open an issue
- Fork and submit a pull request
- Share feedback

---

## 📄 License

MIT License — Feel free to use this for learning!

See `LICENSE` file for details.

---

## 👨‍💻 Author

**Melba Magiri Gitau**

- 📍 **Location:** Nairobi, Kenya 🇰🇪
- 💼 **Role:** Full-Stack Engineer
- 🔗 **LinkedIn:** [linkedin.com/in/melba-gitau](https://www.linkedin.com/in/melba-gitau/)
- 🐙 **GitHub:** [github.com/Melba-Gitau](https://github.com/Melba-Gitau)
- 📧 **Email:** melba.magiri@gmail.com

---

## 🚀 Getting Started

**Ready to practice?**

👉 **[Open ThinkHire AI](https://thinkhire-ai.vercel.app)**

**Want to contribute?**

Check out the repo: [github.com/Melba-Gitau/ai-interview-coach](https://github.com/Melba-Gitau/ai-interview-coach)

---

## 🙏 Acknowledgments

- **Google Gemini API** — For powerful AI-generated feedback
- **React & Tailwind CSS** — For the beautiful framework
- **Vercel & Railway** — For seamless deployment

---

**Last updated:** June 4, 2026

**Status:** MVP v1.0 — Live & Ready ✅