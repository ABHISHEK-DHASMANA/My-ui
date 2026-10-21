import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./index.html",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        navy: {
          DEFAULT: "hsl(var(--navy))",
          light: "hsl(var(--navy-light))",
        },
        "super-dream": {
          DEFAULT: "hsl(var(--super-dream))",
          hex: "#7c3aed",
        },
        dream: {
          DEFAULT: "hsl(var(--dream))",
          hex: "#2563eb",
        },
        standard: {
          DEFAULT: "hsl(var(--standard))",
          hex: "#16a34a",
        },
        regular: {
          DEFAULT: "hsl(var(--regular))",
          hex: "#d97706",
        },
        expert: "hsl(var(--expert))",
        advanced: "hsl(var(--advanced))",
        pro: "hsl(var(--pro))",
        beginner: "hsl(var(--beginner))",
        bloom: {
          cu: "#3b82f6",
          ap: "#22c55e",
          as: "#eab308",
          ev: "#ef4444",
          cr: "#a855f7",
        },
        sidebar: {
          DEFAULT: "#F8FAFC",
          foreground: "#334155",
          border: "#E5E7EB",
          accent: "#EFF6FF",
          "accent-foreground": "#2563EB",
          background: "hsl(var(--sidebar-background))",
          "sidebar-foreground": "hsl(var(--sidebar-foreground))",
          "sidebar-accent": "hsl(var(--sidebar-accent))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(37, 99, 235, 0.4), 0 0 10px rgba(37, 99, 235, 0.2)",
            opacity: "1",
          },
          "50%": {
            boxShadow: "0 0 14px rgba(37, 99, 235, 0.8), 0 0 20px rgba(37, 99, 235, 0.4)",
            opacity: "0.85",
          },
        },
      },
      animation: {
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
