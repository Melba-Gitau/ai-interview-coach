import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import {
  Brain,
  MessageSquareQuote,
  BookOpenCheck,
  Code2,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-page">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-8 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-accent " />
            AI interview prep, built for developers
          </div>

          {/* Main Heading */}
          <h1 className="mt-8 font-display text-5xl md:text-6xl font-bold text-foreground leading-[1.05] tracking-tight">
            Practice how you{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              think
            </span>
            ,<br />
            not just how you code.
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            ThinkHire AI helps developers articulate their reasoning, explain
            technical decisions, and own their story — so the interview reflects
            who you really are.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/select-stack"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition"
            >
              Get Started
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/interview/technical"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground hover:bg-card/80 transition"
            >
              Try a mock interview
            </Link>
          </div>

          {/* Preview */}
          <div className="relative mt-20 mx-auto max-w-4xl">
            <div className="rounded-3xl border border-border bg-card shadow-elegant overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-gray-50">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">
                  thinkhire / interview / session
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-6 border-r border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Question
                  </p>
                  <p className="mt-4 font-display text-base font-semibold text-foreground leading-snug">
                    Walk me through how you'd design a scalable notification
                    system.
                  </p>
                  <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-muted-foreground">
                    Start with constraints, then components, then trade-offs…
                  </div>
                </div>

                <div className="p-6 bg-gradient-mesh">
                  <p className="text-xs uppercase tracking-wider  font-semibold">
                    AI Feedback
                  </p>
                  <ul className="mt-4 space-y-3">
                    {[
                      ["Clarity", "Strong opening, clear scope."],
                      ["Structure", "Add a brief summary at the end."],
                      ["Reasoning", "Mention queue back-pressure trade-offs."],
                    ].map(([label, text]) => (
                      <li key={label} className="flex gap-2 text-sm">
                        <span className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                        <div>
                          <span className="font-semibold text-foreground">
                            {label}.
                          </span>
                          <span className="text-muted-foreground"> {text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-8 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold mb-2">What you get</p>
          <h2 className="text-4xl md:text-4xl font-bold text-foreground">
            Everything to communicate like a senior <br /> engineer.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
          {[
            {
              icon: Brain,
              title: "AI Mock Interviews",
              desc: "Realistic technical, behavioral, and system design rounds — at your pace.",
            },
            {
              icon: MessageSquareQuote,
              title: "Thought Process Coaching",
              desc: "Get scored on clarity, structure, reasoning, and delivery.",
            },
            {
              icon: BookOpenCheck,
              title: "Behavioral Practice",
              desc: 'Master "tell me about a time…" with the STAR framework, tuned for engineers.',
            },
            {
              icon: Code2,
              title: "Project Story Builder",
              desc: "Turn your favorite project into a compelling 90-second story.",
            },
          ].map((feature, i) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <FeatureIcon className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-md font-bold black mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      {/* How It Works */}
      <section id="how" className="max-w-6xl mx-auto px-8 py-16">
        <div className="rounded-2xl bg-gradient-hero p-10 md:p-12 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
          <div className="relative grid gap-10 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Pick a round",
                d: "Technical, behavioral, or system design — choose what you need to sharpen.",
              },
              {
                n: "02",
                t: "Think out loud",
                d: "Answer one question at a time. No timer pressure. Just practice.",
              },
              {
                n: "03",
                t: "Get coached",
                d: "AI feedback on clarity, structure, reasoning, and communication.",
              },
            ].map((step) => (
              <div key={step.n}>
                <p className="font-display text-5xl font-bold opacity-25">
                  {step.n}
                </p>
                <h3 className="mt-3 text-xl font-bold">{step.t}</h3>
                <p className="mt-2 text-xs opacity-90 leading-relaxed">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-8 py-10 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Your code is ready. Are your words?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Start a mock interview in under 30 seconds. No signup needed for MVP.
        </p>
        <Link
          to="/select-stack"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition"
        >
          Open the Dashboard <span>→</span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
        © 2026 Interview Coach. Built for developers who want to be heard.
      </footer>
    </div>
  );
}
