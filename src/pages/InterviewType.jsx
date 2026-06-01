import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Brain, MessageSquareQuote, Network } from "lucide-react";

export default function InterviewType() {
  const interviewTypes = [
    {
      id: "technical",
      icon: Brain,
      title: "Technical",
      desc: "Engineering problems and trade-offs.",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "behavioral",
      icon: MessageSquareQuote,
      title: "Behavioral",
      desc: "Story-driven, STAR-friendly.",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "system-design",
      icon: Network,
      title: "System Design",
      desc: "Architecture and scale.",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />

      <main className="mx-auto max-w-6xl px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-accent mb-2">
            MOCK INTERVIEW
          </p>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            Choose your round
          </h1>
        </div>

        {/* Interview Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {interviewTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Link
                key={type.id}
                to={`/interview/chat/${type.id}`}
                className="group rounded-xl border border-border bg-card p-5 hover:shadow-elegant transition"
              >
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${type.color} mb-4`}
                >
                  <Icon className={`h-5 w-5 ${type.iconColor}`} />
                </div>

                <h2 className="text-base font-bold font-display text-foreground mb-2">
                  {type.title}
                </h2>

                <p className="text-xs text-muted-foreground mb-4">
                  {type.desc}
                </p>

                <div className="inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:translate-x-0.5 transition">
                  Start
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Story Builder CTA */}
        <p className="text-xs text-muted-foreground">
          Prefer to structure your own story first?{" "}
          <Link
            to="/story-builder"
            className="font-semibold text-foreground hover:text-primary transition"
          >
            Open the Story Builder →
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
