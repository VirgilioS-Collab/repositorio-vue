/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00205B',         // Azul oscuro (botones, navbar)
        accent: '#E4B95B',          // Amarillo dorado (íconos, botones)
        soft: '#F8F9FA',            // Gris claro de fondo
        card: '#ffffff',            // Fondo de tarjetas
        confirmed: '#D1FAE5',       // Verde claro para confirmados
        pending: '#FEF3C7',         // Amarillo claro para pendientes
        darkText: '#1F2937',        // Gris oscuro para texto principal
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        serif: ['Libre Baskerville', 'serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',  // Sombra suave para tarjetas
      },
      borderRadius: {
        lg: '0.75rem', // Bordes redondeados más marcados
      }
    },
  },
  plugins: [],
}
