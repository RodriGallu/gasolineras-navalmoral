import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)"],
        body: ["var(--font-inter)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        fuel: {
          50: "#fff8f0",
          100: "#ffecd0",
          200: "#ffd599",
          300: "#ffb84d",
          400: "#ff9500",
          500: "#f07800",
          600: "#c75d00",
          700: "#9a4400",
          800: "#7a3500",
          900: "#5c2800",
        },
        dark: {
          50: "#f0f0f2",
          100: "#d5d5dc",
          200: "#aaaabb",
          300: "#808097",
          400: "#555574",
          500: "#2b2b51",
          600: "#1a1a38",
          700: "#111128",
          800: "#0b0b1c",
          900: "#060610",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "pulse-slow": "pulse 3s infinite",
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
