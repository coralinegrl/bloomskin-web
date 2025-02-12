/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff80ab",
        secondary: "#ff4081",
        background: "#fff0f6",
        text: "#333",
      },
    },
  },
  plugins: [],
};
