/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#121D55",
          dark: "#0C1440",
          light: "#1E2E7A",
        },
        accent: {
          DEFAULT: "#4A90D9",
          light: "#6BA5E7",
        },
        surface: {
          DEFAULT: "#F8F9FF",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Manrope_400Regular"],
        "manrope-light": ["Manrope_200ExtraLight"],
        "manrope-regular": ["Manrope_400Regular"],
        "manrope-medium": ["Manrope_500Medium"],
        "manrope-semibold": ["Manrope_600SemiBold"],
        "manrope-bold": ["Manrope_700Bold"],
        "manrope-extrabold": ["Manrope_800ExtraBold"],
      },
    },
  },
  plugins: [],
};
