import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ArrowLeft, Trash2, Sparkles } from "lucide-react";

export default function ResponseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Load sessions from localStorage
    const saved = localStorage.getItem("interviewSessions");
    if (saved) {
      const sessions = JSON.parse(saved);
      const found = sessions.find((s) => s.id === parseInt(id));
      setSession(found);
    }
  }, [id]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-page">
        <Navbar />
        <main className="mx-auto max-w-4xl px-12 py-12">
          <p className="text-center text-muted-foreground">Session not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const getTypeLabel = (type) => {
    const labels = {
      technical: "TECHNICAL",
      behavioral: "BEHAVIORAL",
      "system-design": "SYSTEM DESIGN",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      technical: "bg-blue-100 text-blue-700",
      behavioral: "bg-green-100 text-green-700",
      "system-design": "bg-purple-100 text-purple-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const handleDelete = () => {
    const saved = localStorage.getItem("interviewSessions");
    if (saved) {
      const sessions = JSON.parse(saved);
      const updated = sessions.filter((s) => s.id !== session.id);
      localStorage.setItem("interviewSessions", JSON.stringify(updated));
    }
    navigate("/responses");
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />

      <main className="mx-auto max-w-4xl px-12 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/responses")}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to responses
        </button>

        {/* Header */}
        <div className="mb-8">
          <p
            className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor(session.type)} inline-block mb-3`}
          >
            {getTypeLabel(session.type)} • {session.date.toUpperCase()}
          </p>
          <h1 className="text-md font-bold text-foreground">
            {session.question}
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Score */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 text-center">
            <p className="text-xs font-semibold text-blue-600 mb-2">
              OVERALL SCORE
            </p>
            <p className="text-2xl font-bold font-display text-blue-700">
              {session.score}
            </p>
          </div>

          {/* Your Answer */}
          <div>
            <h2 className="text-md font-semibold text-foreground mb-2">
              Your Answer
            </h2>
            <div className="bg-gray-50 border border-border rounded-lg p-4">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {session.answer}
              </p>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <div className="inline-flex items-center gap-2 text-md font-semibold text-foreground mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent " />
              AI Feedback
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {session.feedback}
              </p>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete Session
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
