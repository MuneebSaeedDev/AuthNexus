/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ededed',
        panel: {
          left: '#ffffff',
          right: '#f8fafc'
        },
        primary: {
          DEFAULT: '#f97316',
          hover: '#ea580c',
          focus: 'rgba(249, 115, 22, 0.25)'
        },
        text: {
          primary: '#111827'
        },
        border: {
          input: '#d1d5db'
        }
      }
    },
  },
  plugins: [],
}
