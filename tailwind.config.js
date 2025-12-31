/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Next.js App Router files
    "./components/**/*.{js,ts,jsx,tsx}", // Any components folder
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [],
};
