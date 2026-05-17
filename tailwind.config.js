/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        level1: "#dc2626",
        level2: "#f97316",
        level3: "#eab308",
        level4: "#22c55e",
        level5: "#0ea5e9",
      },
    },
  },
  plugins: [],
};
