// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        crimson: ["'Crimson Text'", "serif"],
        NanumMyeongjo: ["'Nanum Myeongjo'", "serif"],
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
      };
      addUtilities(newUtilities);
    },
  ],
};
export default config;
