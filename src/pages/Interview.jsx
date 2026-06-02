import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { RotateCcw } from "lucide-react";

export default function Interview() {
  const { type } = useParams();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [question, setQuestion] = useState("");
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
      const res = await fetch("https://ai-interview-coach-production-7ac4.up.railway.app/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load question");
      }
      setQuestion(data.question);
    } catch (error) {
      console.error("Error fetching question:", error);
      setQuestionError(
        error.message ||
          "Could not load question. Is the API server running on port 5000?",
      );
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
      const res = await fetch("https://ai-interview-coach-production-7ac4.up.railway.app/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, type }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
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

      <main className="mx-auto max-w-6xl px-12 py-12">
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
                <p className="text-xl font-bold text-muted-foreground">
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
                <h2 className="text-xl font-bold text-foreground">
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
                    onClick={() => setAnswer("")}
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
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-500 text-sm">✨</span>
              <p className="text-xs font-semibold text-foreground">
                AI FEEDBACK
              </p>
            </div>

            {feedback ? (
              <div>
                <p className="text-xs text-foreground whitespace-pre-wrap">
                  {feedback}
                </p>
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
