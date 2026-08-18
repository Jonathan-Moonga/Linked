import type { Config } from "tailwindcss";

// Tokens pulled directly from the Figma "Linked prototype" file —
// same gray fields, corner radii, and type scale used across every screen.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        field: "#F1F5F9",
        ink: "#0F172A",
        panel: "#EAF1F8",
      },
      borderRadius: {
        input: "12px",
        pill: "9999px",
        tab: "35px", // Sign Up / Sign In tab toggle
        panel: "15px", // bottom device-chrome panel
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        device: "1152px",
      },
    },
  },
  plugins: [],
};

export default config;
