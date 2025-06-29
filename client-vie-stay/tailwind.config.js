/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        1100: "1100px",
      },
      colors: {
        primary: "#F5F5F5",
        secondary1: "#1266dd",
        secondary2: "#F73859",
        "overlay-10": "rgba(0, 0, 0, 0.1)",
        "overlay-20": "rgba(0, 0, 0, 0.2)",
        "overlay-30": "rgba(0, 0, 0, 0.3)",
        "overlay-40": "rgba(0, 0, 0, 0.4)",
        "overlay-50": "rgba(0, 0, 0, 0.5)",
        "overlay-60": "rgba(0, 0, 0, 0.6)",
      },
      maxWidth: {
        600: "600px",
        1100: "1100px",
      },
      cursor: {
        pointer: "pointer",
      },
      flex: {
        3: "3 3 0%",
      },
    },
  },
  plugins: [],
};
