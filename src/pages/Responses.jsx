import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { X, Trash2, Brain } from "lucide-react";

export default function Responses() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Load sessions from localStorage
    const saved = localStorage.getItem("interviewSessions");
    if (saved) {
      setSessions(JSON.parse(saved));
    } else {
      // Sample data for MVP
      setSessions([
        {
          id: 1,
          type: "technical",
          date: "today",
          question: "Design a scalable notification system",
          answer: "I would start by identifying the constraints...",
          feedback: "Strong opening with clear scope definition...",
          score: 82,
        },
        {
          id: 2,
          type: "behavioral",
          date: "yesterday",
          question: "Time you handled a difficult challenge",
          answer: "There was a project where...",
          feedback: "Good use of STAR framework...",
          score: 76,
        },
        {
          id: 3,
          type: "system-design",
          date: "3 days ago",
          question: "Real-time chat for 1M users",
          answer: "I would use a message queue...",
          feedback: "Excellent technical depth...",
          score: 71,
        },
      ]);
    }
  }, []);

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

  const handleDelete = (id) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem("interviewSessions", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />

      <main className="mx-auto max-w-4xl px-12 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-500 mb-2">
            SAVED SESSIONS
          </p>
          <h1 className="text-3xl font-bold text-foreground font-display mb-3">
            My Responses
          </h1>
          <p className="text-sm text-muted-foreground">
            Save real sessions from the interview screen and review them here.
          </p>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No saved sessions yet.
              </p>
              <Link
                to="/select-stack"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition"
              >
                Start an interview
              </Link>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-elegant transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className={` rounded-lg`}>
                      <Brain className="w-6 h-6 text-accent" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-2">
                        <span
                          className={`text-xs font-semibold text-gray-500 `}
                        >
                          {getTypeLabel(session.type)} •{" "}
                          {session.date.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                        {session.question}
                      </h3>
                    </div>
                  </div>

                  {/* Score + Actions */}
                  <div className="text-right ml-4">
                    <p className="text-3xl font-bold font-display mb-2">
                      {session.score}
                    </p>
                    <Link
                      to={`/response/${session.id}`}
                      className="px-4 py-2 rounded-lg border border-border hover:bg-blue-50 text-blue-600 text-sm font-medium transition"
                    >
                      Open →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
