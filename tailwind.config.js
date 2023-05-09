/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,html,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B0746",
        secondary: "#DD1B10",
        transparentGray: "rgba(7, 6, 61, 0.1)",
        placeholder: "#6C6C6C",
        primaryDark: "#05022B",
        primaryLight: "#464590",
        accent1: "#7B79FF",
        disabled: "#6A6A6A",
        lightGray: "#D9D9D9",
      },
    },
  },
  plugins: [],
};
