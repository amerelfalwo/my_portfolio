/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      none: '0',
      lg: '0.5rem',
      full: '9999px',
    },
    extend: {
      colors: {
        background: "#F8F8F8",
        surface: "#FFFFFF",
        'surface-muted': "#F0F0F0",
        foreground: "#222222",
        muted: "#5F5F5F",
        border: "rgba(0, 0, 0, 0.08)",
      },
      borderColor: {
        DEFAULT: "rgba(0, 0, 0, 0.08)",
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Arabic', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}