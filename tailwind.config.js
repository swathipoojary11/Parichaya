/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          orange: "#F97316",
          amber: "#FB923C",
          black: "#09090B",
          surface: "#18181B",
          border: "#27272A",
          text: "#FAFAFA",
          muted: "#A1A1AA"
        }
      }
    }
  },
  plugins: []
};
