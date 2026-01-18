import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--color-bg) / <alpha-value>)",
        surface: "hsl(var(--color-surface) / <alpha-value>)",
        "surface-hover": "hsl(var(--color-surface-hover) / <alpha-value>)",
        text: "hsl(var(--color-text) / <alpha-value>)",
        muted: "hsl(var(--color-muted) / <alpha-value>)",
        inverse: "hsl(var(--color-inverse) / <alpha-value>)",
        link: "hsl(var(--color-link) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        secondary: "hsl(var(--color-secondary) / <alpha-value>)",
        "secondary-muted": "hsl(var(--color-secondary-muted) / <alpha-value>)",
        accent: "hsl(var(--color-accent) / <alpha-value>)",
        "accent-muted": "hsl(var(--color-accent-muted) / <alpha-value>)"
      }
    }
  },
  plugins: []
};

export default config;
