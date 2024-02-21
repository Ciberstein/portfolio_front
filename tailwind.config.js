/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "cutive-mono": ["Cutive Mono", "monospace"],
        "victor-mono": ["Victor Mono", "monospace"],
        righteous: ["Righteous", "monospace"],
      },
      colors: {
        dark: {
          primary: { 500: "#00ffff", 700: "#172525" },
          secondary: { 700: "#080d0d" },
        },
        light: {
          primary: { 500: "#292929", 700: "#676767" },
          secondary: { 700: "#fafafa" },
        },
      },
      clipPath: {
        angle: "polygon(40px 0, 100% 0, 100% 100%, 0 100%, 0 40px)",
      },
    },
  },
  plugins: [],
};
