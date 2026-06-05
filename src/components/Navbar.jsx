import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-semibold text-foreground hover:opacity-80 transition"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Brain className="h-4 w-4" />
          </span>
          ThinkHire{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            AI
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Home
          </Link>
          <Link
            to="/select-stack"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Dashboard
          </Link>
          <Link to="/responses" className="hover:text-primary transition">
            My Responses
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          to="/select-stack"
          className="inline-flex h-9 items-center rounded-full bg-black text-primary-foreground px-6 text-sm font-semibold shadow-glow hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
