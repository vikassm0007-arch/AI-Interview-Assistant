/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: '#4F46E5',    // Trust Indigo
          emerald: '#10B981',   // Growth Emerald
          amber: '#F59E0B',     // Alert Amber
          charcoal: '#0F172A',  // Slate Charcoal
          alabaster: '#F8FAFC', // Cool Alabaster
          platinum: '#E2E8F0',  // Soft Platinum
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
