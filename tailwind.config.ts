// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        crimson: ["'Crimson Text'", "serif"],
        noto: ['"Noto Sans KR"', "sans-serif"],
        lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
