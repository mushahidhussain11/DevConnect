/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out-down": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out-down": "fade-out-down 0.5s ease-out",
      },
      fontFamily: {
        inter: ["Inter"],
      },
      spacing: {
        0.5: "2px",
        1: "4px",
        2: "8px",
        4: "16px",
        6: "24px",
        8: "32px",
      },
      colors: {
        primary: "#4C68D5",
        secondary: "#F6F7FB",
        accent: "#FF7A00",
        dark: "#1D1F23",
        text: "#333333",
        testred: "#FF0000",
      },
    },
  },
  plugins: [],
};
