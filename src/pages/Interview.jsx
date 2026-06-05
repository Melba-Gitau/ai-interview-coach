import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { RotateCcw, Sparkles, Save } from "lucide-react";

export default function Interview() {
  const { type } = useParams();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState(0);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [questionError, setQuestionError] = useState("");
  const [loading, setLoading] = useState(false);

  const feedbackCriteria = {
    technical: ["Clarity", "Structure", "Technical reasoning", "Communication"],
    behavioral: ["Clarity", "Structure", "Specific example", "Learnings"],
    "system-design": [
      "Requirements",
      "Architecture",
      "Trade-offs",
      "Scalability",
    ],
  };

  const fetchQuestion = useCallback(async () => {
    setQuestionLoading(true);
    setQuestionError("");
    setQuestion("");
    try {
      const res = await fetch(
        "https://ai-interview-coach-production-7ac4.up.railway.app/api/question", 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        },
      );
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Daily limit reached (20 requests/day). Please try again tomorrow!");
        }
        throw new Error(data.error || "Failed to load question");
      }
      
      setQuestion(data.question);
    } catch (error) {
      console.error("Error fetching question:", error);
      setQuestionError(error.message || "Could not load question. Please try again.");
    } finally {
      setQuestionLoading(false);
    }
  }, [type]);


  // Fetch a new question when page loads
  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("Please provide an answer");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://ai-interview-coach-production-7ac4.up.railway.app/api/feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer, type }),
        },
      );
      const data = await res.json();
      setFeedback(data.feedback);
      setScore(data.score || 70); 

      const sessionId = Date.now();

      const newResponse = {
        id: Date.now(),
        type: type,
        date: 'today',
        question: question,
        answer: answer,
        feedback: data.feedback,
        score: data.score || 75, // Use score from backend
      };
  
      // Get existing sessions
      const existing = localStorage.getItem('interviewSessions');
      const sessions = existing ? JSON.parse(existing) : [];
  
      // Add new response
      sessions.push(newResponse);
  
      // Save back to localStorage
      localStorage.setItem('interviewSessions', JSON.stringify(sessions));

    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const wordCount = answer.trim().split(/\s+/).length;

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 md:px-12 py-8 md:py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs font-semibold text-accent mb-1">
              MOCK INTERVIEW
            </p>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              {type?.charAt(0).toUpperCase() + type?.slice(1).replace("-", " ")}{" "}
              round
            </h1>
          </div>
          <Link
            to="/interview/technical"
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-card transition text-xs font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            Change round
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
          {/* Left Column - Question & Answer */}
          <div className="rounded-xl border border-border bg-card p-8">
            {/* Question Section */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-muted-foreground mb-3">
                QUESTION 1
              </p>
              {questionLoading ? (
                <p className="text-lg md:text-xl font-display font-bold text-muted-foreground">
                  Loading your question...
                </p>
              ) : questionError ? (
                <div>
                  <p className="text-sm text-red-600 mb-3">{questionError}</p>
                  <button
                    type="button"
                    onClick={fetchQuestion}
                    className="px-4 py-2 rounded-full border border-border bg-white hover:bg-gray-50 text-xs font-semibold"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <h2 className="text-lg md:text-xl font-display font-bold text-foreground">
                {question}
              </h2>
              )}
            </div>

            {/* Answer Section */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-2 block">
                Your answer
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Think out loud. Start with constraints, structure your answer, name the trade-offs..."
                className="w-full h-64 bg-gray-50 border border-border rounded-lg p-2 text-xs resize-none focus:outline-none focus:border-primary"
              />

              {/* Word Count & Buttons */}
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-muted-foreground">
                  {wordCount} words
                </p>
                <div className="flex gap-2">
                <button
                   onClick={() => {
                       setAnswer("");
                       setFeedback("");
                       fetchQuestion();
                  }}
                  className="px-4 py-2 rounded-full border border-border bg-white hover:bg-gray-50 text-xs font-semibold transition"
                  >     
                   Skip
                </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !answer.trim()}
                    className="px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition disabled:opacity-50"
                  >
                    {loading ? "Getting feedback..." : "Submit →"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Feedback */}
         {/* Right Column - Feedback */}
{/* Right Column - Feedback */}
<div className={`rounded-xl border p-6 ${feedback ? 'border-blue-200' : 'border-border bg-card'}`} style={feedback ? {background: 'linear-gradient(135deg,rgb(247, 247, 247) 0%,rgb(106, 156, 199) 100%)'} : {}}>
  <div className="flex items-center gap-2 mb-6">
  <Sparkles className="w-3.5 h-3.5 text-accent " />
    <p className="text-xs font-semibold text-foreground">
      AI FEEDBACK
    </p>
  </div>

  {feedback ? (
  <div className="space-y-6">
    {/* Criteria Breakdown */}
    <div className="space-y-4">
      {feedbackCriteria[type]?.map((criterion) => {
        const criteriaScore = Math.max(1, Math.round((score / 100) * 10));
        const progressWidth = (criteriaScore / 10) * 100;

        // Generic tips for each criterion
        const tipsByType = {
          technical: {
            "Clarity": "Add a sentence to frame the problem before diving in.",
            "Structure": "Try a 3-beat structure: context → approach → trade-offs.",
            "Technical reasoning": "Tie your story to a measurable outcome.",
            "Communication": "Slow down on the punchline — it lands harder.",
          },
          behavioral: {
            "Clarity": "Be specific about what happened, not vague descriptions.",
            "Structure": "Use STAR: Situation → Task → Action → Result.",
            "Specific example": "Include concrete details and numbers.",
            "Learnings": "Explain what you learned and how you'd handle it next time.",
          },
          "system-design": {
            "Requirements": "Clarify constraints before jumping to solutions.",
            "Architecture": "Explain your architecture decisions clearly.",
            "Trade-offs": "Discuss trade-offs and why you chose this approach.",
            "Scalability": "Consider how your system scales with growth.",
          },
        };

        const tips = tipsByType[type] || {};
        const tip = tips[criterion] || "Keep improving on this area.";
        
        return (
          <div key={criterion}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-foreground">{criterion}</p>
              <p className="text-sm font-bold text-primary">{criteriaScore}/10</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{width: `${progressWidth}%`}}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {tip}
            </p>
          </div>
        );
      })}
    </div>

    {/* Try Next */}
    <div className="bg-gray-50 border border-border rounded-lg p-4">
      <p className="text-xs font-semibold text-foreground mb-2">TRY NEXT</p>
      <p className="text-xs text-muted-foreground">
        {feedback.substring(0, 100)}...
      </p>
    </div>

    {/* Buttons */}
    <div className="flex gap-3 pt-4">
      <button
        onClick={() => {
          setAnswer("");
          setFeedback("");
          setScore(0);
          fetchQuestion();
        }}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-gray-50 text-sm font-semibold transition"
      >
        Save session
      </button>
      <Link
        to={`/response/${window.currentSessionId || Date.now()}`}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-gray-50 text-sm font-semibold transition text-center"
      >
        See overall score →
      </Link>
      <button
        onClick={() => {
          setAnswer("");
          setFeedback("");
          setScore(0);
          fetchQuestion();
        }}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-foreground hover:bg-gray-800 text-white text-sm font-semibold transition"
      >
        Next question →
      </button>
    </div>
  </div>
) : (
    <div>
      <p className="text-xs text-muted-foreground mb-3">
        Feedback will appear here.
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        Submit your answer to get coaching across clarity, structure,
        reasoning, and delivery.
      </p>
      <ul className="space-y-1.5">
        {feedbackCriteria[type]?.map((criterion) => (
          <li
            key={criterion}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span className="w-1 h-1 rounded-full bg-green-500"></span>
            {criterion}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
