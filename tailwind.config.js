/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#fcfbf8",
        foreground: "#1a1a1a",
        card: "#ffffff",
        "muted-foreground": "#666666",
        border: "#e5e5e5",
        accent: "#10b981",
        "accent-foreground": "#ffffff",
        primary: "#0066cc",
        "primary-foreground": "#ffffff",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, oklch(22% .12 260) 0%, oklch(35% .16 250) 55%, oklch(55% .14 180) 100%)",
        "gradient-page": "linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%)",
        "gradient-primary":
          "linear-gradient(135deg, var(--primary) 0%, var(--primary-glow) 100%)",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0, 0, 0, 0.05)",
        elegant: "0 10px 30px rgba(0, 0, 0, 0.1)",
        glow: "0 0 30px rgba(0, 102, 204, 0.3)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
