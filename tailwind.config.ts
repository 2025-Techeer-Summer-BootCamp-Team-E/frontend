// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        crimson: ["'Crimson Text'", "serif"],
        NanumMyeongjo: ["'Nanum Myeongjo'", "serif"],
        noto: ['"Noto Sans KR"', "sans-serif"],
        lora: ["Lora", "serif"],
      },
      dropShadow: {
        floor: "0px 20px 24px rgba(0, 0, 0, 0.45)",
        // 다른 커스텀 그림자도 추가 가능
        lora: ['Lora', 'serif'],
        nanumMyeongjo: ['"Nanum Myeongjo"', 'serif'],
        nanumGothic: ['"Nanum Gothic"', 'sans-serif'],
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        '.scrollbar-fancy': {
          /* WebKit */
          '&::-webkit-scrollbar': {
            width: '20px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F9F9F9',
            borderRadius: '30px',
            border: '1px solid #B2B2B2',
          },
          '&::-webkit-scrollbar-thumb': {
           boxSizing: 'border-box',
           backgroundcolor: '#A2A2A2',
           borderRadius: '30px',
           border: '3px solid transparent',
           backgroundClip: 'content-box',
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
export default config;
