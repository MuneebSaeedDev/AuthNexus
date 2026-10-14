/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        panel: {
          left: '#ffffff',
          right: '#0f172a'
        },
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          focus: 'rgba(37, 99, 235, 0.25)'
        },
        text: {
          primary: '#0f172a',
          secondary: '#64748b',
          muted: '#94a3b8'
        },
        border: {
          input: '#e2e8f0',
          subtle: '#f1f5f9'
        }
      },
      boxShadow: {
        'card': '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
        'elevated': '0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.02)',
      }
    },
  },
  plugins: [],
}
