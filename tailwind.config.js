/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#28A745',
        secondary: '#17A2B8',
        accent: '#FFC107',
        background: '#F8F9FA',
        text: '#343A40',
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',      // Extra small text
        sm: '0.875rem',     // Small text
        base: '1rem',       // Base text, equivalent to 16px
        lg: '1.125rem',     // Large text
        xl: '1.25rem',      // Extra large text
        '2xl': '1.5rem',    // 2x extra large text
        '3xl': '1.875rem',  // 3x extra large text
        '4xl': '2.25rem',   // 4x extra large text
        '5xl': '3rem',      // 5x extra large text
        '6xl': '3.75rem',   // 6x extra large text
      },
    },
  },
};
