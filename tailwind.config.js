/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#6B4226",
        secondary: "#D6A77A",
        accent: "#FFF8F2",
        grayCustom: "#888888",
        'brown-dark': '#3d1f0f',
        'brown-light': '#6B4226',
      },
    },
  },
  plugins: [],
};
