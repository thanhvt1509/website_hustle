/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1677ff",
      },
      fontFamily: {
        body: ["Quicksand", "sans-serif"],
      },
    },
  },
  plugins: [],
};
