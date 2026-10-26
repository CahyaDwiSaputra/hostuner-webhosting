/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-brand-50, #eff6ff)',
          100: 'var(--color-brand-100, #dbeafe)',
          200: 'var(--color-brand-200, #bfdbfe)',
          300: 'var(--color-brand-300, #93c5fd)',
          400: 'var(--color-brand-400, #60a5fa)',
          500: 'var(--color-brand-500, #3b82f6)',
          600: 'var(--color-brand-600, #2563eb)',
          700: 'var(--color-brand-700, #1d4ed8)',
          800: 'var(--color-brand-800, #1e40af)',
          900: 'var(--color-brand-900, #1e3a8a)',
          950: 'var(--color-brand-950, #0f172a)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
