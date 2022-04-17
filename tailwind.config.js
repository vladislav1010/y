const gray = {
  50: "#f7f8f9",
  100: "#e7e8ec",
  300: "#c5c7cd",
  400: "#aaacb4",
  500: "#92959e",
  600: "#727581",
  700: "#5c5e6A",
  800: "#3a3c45",
};

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      textColor: {
        quiet: gray["400"],
      },
      colors: {
        gray,
        darken: {
          1: "rgba(0,0,0,0.05)",
          2: "rgba(0,0,0,0.1)",
        },
        pink: "#f922a3",
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
