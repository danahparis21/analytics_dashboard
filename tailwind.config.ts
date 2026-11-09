import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spartan: {
          50: "#fff1f3",
          100: "#ffe4e7",
          200: "#fecdcf",
          300: "#fea3a7",
          400: "#fb6d74",
          500: "#f23c46",
          600: "#df1d28",
          700: "#bc131d",
          800: "#9b141c",
          900: "#8a1538",
          950: "#4d0617",
        },
      },
    },
  },
  plugins: [],
};

export default config;
