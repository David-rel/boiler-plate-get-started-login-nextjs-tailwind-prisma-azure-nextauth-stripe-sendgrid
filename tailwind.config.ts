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
        navy: {
          DEFAULT: "#00284f", // Base navy color
          light: "#334d66", // Lighter navy
          dark: "#001a36", // Darker navy
        },
        teal: {
          DEFAULT: "#026b6b", // Base teal color
          light: "#338787", // Lighter teal
          dark: "#005454", // Darker teal
        },
        silver: {
          DEFAULT: "#C0C0C0", // Base silver color
          light: "#D9D9D9", // Lighter silver
          dark: "#A6A6A6", // Darker silver
        },
        lightgrey: {
          DEFAULT: "#D3D3D3", // Base light grey color
          light: "#E0E0E0", // Lighter light grey
          dark: "#B7B7B7", // Darker light grey
        },
        orange: {
          DEFAULT: "#FFA500", // Base orange color
          light: "#FFB733", // Lighter orange
          dark: "#CC8400", // Darker orange
        },
        gold: {
          light: "#CBA96F", // Lighter gold
          DEFAULT: "#A37E2C", // Base gold color
          dark: "#7A5C1F", // Darker gold
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
