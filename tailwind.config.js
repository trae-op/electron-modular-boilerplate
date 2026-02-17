/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,cts,mts}"],
  theme: {
    extend: {
      transitionProperty: {
        colors:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
        opacity: "opacity",
        transform: "transform",
      },
    },
  },
  corePlugins: {
    container: false,
    aspectRatio: false,
    backdropFilter: false,
  },
  plugins: [],
};
