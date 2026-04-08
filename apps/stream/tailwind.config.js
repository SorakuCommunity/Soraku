const defaultTheme = require("tailwindcss/defaultTheme");
const scrollbarPlugin = require("tailwind-scrollbar");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    screens: {
      xxs: "375px",
      xs: "425px",

      ...defaultTheme.screens
    },
    extend: {
      animation: {
        text: "text 5s ease infinite"
      },
      keyframes: {
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center"
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center"
          }
        }
      },
      boxShadow: {
        menu: "0 0 10px 0px rgba(255, 107, 0, 0.1)",
        light: "0 2px 10px 2px rgba(0, 0, 0, 0.1)",
        button: "0 0px 5px 0.5px rgba(0, 0, 0, 0.1)"
      },
      textColor: {
        "gray-500": "#6c757d"
      },
      fontWeight: {
        bold: "700"
      },
      padding: {
        nav: "5.3rem"
      },
      colors: {
        primary: "#000000",
        secondary: "#212127",
        action: "#823398",
        image: "#3B3C41",
        txt: "#dbdcdd",
        tersier: "#0c0d10"
      }
    },
    fontFamily: {
      Archivo: ["Archivo", "sans-serif"],
      Archivo: ["Archivo", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      inter: ["Inter", "sans-serif"]
    }
  },
  variants: {
    extend: {
      display: ["group-focus"],
      opacity: ["group-focus"],
      inset: ["group-focus"],
      backgroundImage: ["dark"]
    },
    textColor: ["responsive", "hover", "focus"],
    fontWeight: ["responsive", "hover", "focus"],
    scrollbar: ["rounded"]
  },
  plugins: [
    scrollbarPlugin({
      nocompatible: true
    }),
    require("tailwind-scrollbar-hide"),
    require("@vidstack/react/tailwind.cjs")({
      // Change the media variants prefix.
      prefix: "media"
    }),
    require("tailwindcss-animate"),
    customVariants
  ]
};

function customVariants({ addVariant, matchVariant }) {
  // Strict version of `.group` to help with nesting.
  matchVariant("parent-data", (value) => `.parent[data-${value}] > &`);
  addVariant("hocus", ["&:hover", "&:focus-visible"]);
  addVariant("group-hocus", [".group:hover &", ".group:focus-visible &"]);
}
