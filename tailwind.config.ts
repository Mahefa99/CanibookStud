import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors sampled from the supplied logo.
        navy: {
          50: "#EFF4FA",
          100: "#DCE7F3",
          200: "#B9CFE6",
          300: "#8AAFD2",
          400: "#4E7FAE",
          500: "#1F5A92",
          600: "#0B4276",
          700: "#002B58",
          800: "#002046",
          900: "#001731",
        },
        orange: {
          50: "#FFF4EC",
          100: "#FFE5D3",
          200: "#FFC9A6",
          300: "#FFA46B",
          400: "#FF8838",
          500: "#FF6E01",
          600: "#E05C00",
          700: "#B64A00",
          800: "#8A3A00",
        },
        cream: {
          50: "#FCFAF6",
          100: "#F7F2E9",
          200: "#EFE7D9",
          300: "#E3D8C6",
        },
        ink: "#0B1B2B",
        muted: "#556274",
        line: "#E5DED2",
        success: {
          50: "#E7F4EE",
          600: "#176B4D",
          700: "#12573E",
        },
        warning: {
          50: "#FFF2D6",
          600: "#8A4B00",
          700: "#6E3C00",
        },
        danger: {
          50: "#FDECEA",
          600: "#A32318",
          700: "#821A12",
        },
        info: {
          50: "#EAF2FB",
          600: "#1D4E89",
          700: "#173E6D",
        },
        plum: {
          50: "#F4EDF5",
          600: "#6B3F69",
          700: "#553153",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-fraunces)",
          "Palatino Linotype",
          "Book Antiqua",
          "Georgia",
          "serif",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 27, 43, 0.04), 0 14px 36px -20px rgba(0, 43, 88, 0.22)",
        lift: "0 2px 4px rgba(11, 27, 43, 0.05), 0 24px 48px -24px rgba(0, 43, 88, 0.32)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.35)",
      },
      maxWidth: {
        shell: "80rem",
        prose: "46rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "fade-up": "fade-up 420ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "soft-pulse": "soft-pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

