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
          amber: "#F59E0B",
          black: "#0F172A",
          emerald: "#10B981",
          slate: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A"
          }
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'panel': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.25)'
      }
    }
  },
  plugins: []
};
