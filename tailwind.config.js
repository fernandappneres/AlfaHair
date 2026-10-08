/** @type {import('tailwindcss').Config} */
module.exports = {
  // Inclui os arquivos JS porque as classes dos cards de serviço são geradas dinamicamente.
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf7ef',
          100: '#f4ead3',
          200: '#e8d3a3',
          300: '#dab76c',
          400: '#cf9f47',
          500: '#b8862f',
          600: '#9a6a26',
          700: '#7b5022',
          800: '#664222',
          900: '#573820',
        },
        ink: {
          DEFAULT: '#1c1917',
          soft: '#44403c',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
