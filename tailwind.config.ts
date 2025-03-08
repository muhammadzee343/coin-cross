import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          main: "var(--primary-main)",
          light: "var(--primary-light)",
          white: "var(--primary-white)",
          green: "var(--primary-green)",
          black: "var(--primary-black)",
          dark: "var(--primary-dark)",
          lightGray: "var(--primary-lightGray)",
          gray: "var(--primary-gray)",
        },
        secondary: {
          dark: "var(--secondary-dark)",
          greenButton: "var(--secondary-greenButton)",
          gray: "var(--secondary-gray)",
          addButton: "var(--secondary-addButton)",
        },
        background: {
          default: "var(--background-default)",
          card: "var(--background-card)",
          red: "var(--background-red)",
          redishBrown: "var(--background-redish-brown)",
          redishBrownDark: "var(--background-redish-brown-dark)",
          copper: "var(--background-copper)",
          darkBrown: "var(--background-dark-brown)",
          green: "var(--background-green)",
          darkGreen: "var(--background-dark-green)",
        },
        boxShadow: {
          "button-3d": `
            0 0 0 4px rgba(0, 0, 0, 1),
            inset 0 2px 6px 1px rgba(255, 255, 255, 0.3),
            inset 0 -2px 6px 1px rgba(0, 0, 0, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.9)
          `,
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          green: "var(--text-green)",
        },
        error: "var(--error)",
        warning: "var(--warning)",
        success: "var(--success)",
        'primary-purple': '#a396fd',
        'primary-white': '#FFFFFF',
        'background-dark': '#1A1A1A',
      },
      backgroundImage: {
        "redish-brown-gradient":
          "linear-gradient(180deg, #5F1E1E 0%, #300B0B 100%)",
        "copper-gradient": "linear-gradient(180deg, #BE774F 0%, #532F1B 100%)",
        "green-gradient": "linear-gradient(180deg, #449C32 0%, #2F4933 100%)",
      },
      fontFamily: {
        amalta: ["Amalta", "sans-serif"],
        futura: ["Futura", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
    screens: {
      xs: "340px", // Small smartphones
      sm: "370px", // Small smartphones
      md: "390px", // Average smartphones
      lg: "412px", // Large smartphones
      xl: "620px", // Large smartphones
      tab: "768px", // Tablets
      tabXl: "1024px", // Laptops
      desktop: "1440px", // Desktops
    },
  },
  plugins: [],
} satisfies Config;
