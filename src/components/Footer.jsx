export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto max-w-6xl px-8 flex justify-between items-center text-xs text-muted-foreground">
        <p>© 2026 ThinkHire AI. Built for developers who want to be heard.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
