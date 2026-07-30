/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        leaf: "#2f6f4f",
        harvest: "#d89c42",
        berry: "#9d3052",
        mist: "#eef4f1"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 38, 0.12)"
      }
    }
  },
  plugins: []
};
