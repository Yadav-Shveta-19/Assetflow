export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        line: "#d8dee8",
        brand: "#0f766e",
        accent: "#b45309"
      },
      boxShadow: {
        soft: "0 12px 32px rgba(23, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};
