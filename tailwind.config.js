/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // support dark mode later
  theme: {
    extend: {
      colors: {
        cyber: {
          neon: '#10b981',   // emerald for active accent
          cyan: '#06b6d4',   // cyber cyan
          violet: '#8b5cf6', // electric violet
          dark: '#0b0f19',   // rich dark blue-black background
          card: '#161f30',   // dark slate card
          text: '#f8fafc',   // light text
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
