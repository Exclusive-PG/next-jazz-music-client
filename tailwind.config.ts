import { type Config } from "tailwindcss";
import { fontFamily, screens } from "tailwindcss/defaultTheme";
export default {
  content: ["./src/**/*.tsx"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      screens: {
        ...screens,
        // "2xl": { max: "1535px" },
        // // => @media (max-width: 1535px) { ... }

        // "xl": { max: "1279px" },
        // // => @media (max-width: 1279px) { ... }

        // "lg": { max: "1023px" },
        // // => @media (max-width: 1023px) { ... }

        // "md": { max: "767px" },
        // // => @media (max-width: 767px) { ... }

        // "sm": { max: "639px" },
        // => @media (max-width: 639px) { ... }
      },
      colors: {
        darkPrimary: "#272727",
        darkSecondary: "#171818",
        mainRed: "#EE4950",
        textSecondary: "#AFB6B2",
        textRed: "#F3777D",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
