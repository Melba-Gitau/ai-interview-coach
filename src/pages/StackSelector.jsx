import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  Brain,
  MessageSquareQuote,
  Code2,
  BookmarkIcon,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function StackSelector() {
  const mainOptions = [
    {
      id: "mock-interview",
      icon: Brain,
      label: "NEW ROUND",
      title: "Start Mock Interview",
      desc: "Technical, behavioral, or system design. One question, then feedback.",
      featured: true,
      link: "/interview/technical",
    },
    {
      id: "behavioral",
      icon: MessageSquareQuote,
      label: "BEHAVIORAL",
      title: "Behavioral Practice",
      desc: "Sharpen STAR answers for the questions that always come up.",
      featured: false,
      link: "/interview/chat/behavioral",
    },
    {
      id: "technical",
      icon: Code2,
      label: "TECHNICAL",
      title: "Technical Thought Practice",
      desc: "Think out loud — get scored on clarity, structure, and reasoning.",
      featured: false,
      link: "/interview/chat/technical",
    },
    {
      id: "saved",
      icon: BookmarkIcon,
      label: "SAVED",
      title: "My Responses",
      desc: "Revisit past sessions, compare drafts, and track your improvement.",
      featured: false,
      link: "#", // Coming soon
    },
  ];

  const quickStart = [
    "Tell me about yourself",
    "Design a URL shortener",
    "A time you disagreed with a teammate",
  ];

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />

      <main className="mx-auto max-w-6xl px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 text-sm text-accent font-medium">
              <Sparkles className="w-4 h-4" />
              Welcome back
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2 leading-tight">
              Let's get you interview-ready.
            </h1>
            <p className="text-muted-foreground text-lg">
              Pick where you want to sharpen today.
            </p>
          </div>

          {/* Streak - Right Aligned */}
          <div className="hidden md:block px-4 py-3 border border-border rounded-2xl bg-card text-right">
            <p className="text-xs text-muted-foreground mb-1">Current streak</p>
            <p className="text-2xl font-bold text-foreground">
              3 days · 7 sessions
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          {mainOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link
                key={option.id}
                to={option.link}
                className={`group block rounded-xl p-4 transition ${
                  option.featured
                    ? "bg-gradient-hero text-primary-foreground shadow-elegant hover:shadow-glow"
                    : "border border-border bg-card text-foreground hover:shadow-elegant"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Label */}
                    <p
                      className={`text-xs font-semibold tracking-wider mb-2 ${
                        option.featured ? "opacity-70" : "text-muted-foreground"
                      }`}
                    >
                      {option.label}
                    </p>

                    {/* Icon */}
                    <div
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg mb-3 ${
                        option.featured ? "bg-white/20" : "bg-accent/20"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          option.featured ? "text-white" : "text-accent"
                        }`}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-display font-semibold mb-1">
                      {option.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-sm  mb-3 ${
                        option.featured ? "opacity-90" : "text-muted-foreground"
                      }`}
                    >
                      {option.desc}
                    </p>

                    {/* Open Link */}
                    <div
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        option.featured ? "text-white" : "text-foreground"
                      }`}
                    >
                      Open
                      <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Start Section */}

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              to="/interview/chat/behavioral?q=Tell%20me%20about%20a%20time%20you%20overcame%20a%20technical%20challenge"
              className="p-4 border border-border rounded-xl bg-card hover:shadow-elegant transition text-foreground text-center text-sm"
            >
              Tell me about a time you overcame a technical challenge
            </Link>
            <Link
              to="/interview/chat/technical?q=Design%20a%20notification%20system%20for%20millions%20of%20users"
              className="p-4 border border-border rounded-xl bg-card hover:shadow-elegant transition text-foreground text-center text-sm"
            >
              Design a notification system
            </Link>
            <Link
              to="/interview/chat/system-design?q=How%20would%20you%20scale%20a%20real-time%20chat%20application"
              className="p-4 border border-border rounded-xl bg-card hover:shadow-elegant transition text-foreground text-center text-sm"
            >
              How would you scale a real-time chat app
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
