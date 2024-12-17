/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fc802e",
        secondary: "#A4BE7B",
        third: "#5F8D4E",
        forth: "#285430",
      },
      backgroundImage: {
        'header-bg': "url('assets/header1.png')",  // path to your image
      },
    },
  },
  plugins: [],
}

