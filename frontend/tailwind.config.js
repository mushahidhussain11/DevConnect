/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
      },
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '2': '8px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      },
      colors: {
        primary: '#4C68D5',
        secondary: '#F6F7FB',
        accent: '#FF7A00',
        dark: '#1D1F23',
        text: '#333333',
         testred: '#FF0000',
      },
    },
  },
  plugins: [],
}