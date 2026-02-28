import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#4C99C2',
            light: '#6BB0D4',
            dark: '#3A7A9A',
          },
          green: {
            DEFAULT: '#7CBD6A',
            light: '#95D082',
            dark: '#5FA04E',
          },
          navy: {
            DEFAULT: '#142D4A',
            light: '#1E3F5F',
            dark: '#0A1825',
          },
          background: '#F5F7F9',
        },
        primary: {
          DEFAULT: '#4C99C2',
          50: '#EBF5FA',
          100: '#D7EBF5',
          200: '#AFD7EB',
          300: '#87C3E1',
          400: '#6BB0D4',
          500: '#4C99C2',
          600: '#3A7A9A',
          700: '#2C5C73',
          800: '#1E3E4D',
          900: '#0F1F26',
        },
        secondary: {
          DEFAULT: '#7CBD6A',
          50: '#F0F9ED',
          100: '#E1F3DB',
          200: '#C3E7B7',
          300: '#A5DB93',
          400: '#95D082',
          500: '#7CBD6A',
          600: '#5FA04E',
          700: '#47783A',
          800: '#2F5027',
          900: '#182813',
        },
      },
    },
  },
  plugins: [],
};

export default config;
