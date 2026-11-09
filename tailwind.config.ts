import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#15120f",
        panel: "#1f1a15",
        border: "#332a21",
        accent: "#f97316",
        good: "#34d399",
      },
    },
  },
  plugins: [],
} satisfies Config;
