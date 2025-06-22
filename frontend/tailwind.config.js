/** @type {import('tailwindcss').Config} */
export default {
  /**
   * @docstring
   * La propiedad 'content' es la más importante para producción.
   * Le dice a Tailwind qué archivos debe escanear para encontrar las clases
   * que se están utilizando. Durante el 'build', todas las clases no utilizadas
   * serán eliminadas (purgadas) del archivo CSS final, optimizando el tamaño.
   */
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],

  /**
   * @docstring
   * La sección 'theme' es donde personalizamos el sistema de diseño de Tailwind.
   * Usamos 'extend' para añadir nuestras propias personalizaciones sin sobreescribir
   * las que vienen por defecto.
   */
  theme: {
    extend: {
      /**
       * @docstring
       * Aquí definimos nuestra paleta de colores personalizada para el proyecto,
       * asegurando una identidad de marca consistente.
       */
      colors: {
        'primary': '#00205B',        // Azul oscuro principal
        'primary-dark': '#001A4D',   // Versión más oscura para estados :hover
        'accent': '#E4B95B',         // Amarillo/dorado para acentos y botones
        'card': '#FFFFFF',           // Color de fondo para tarjetas
        'soft': '#F8F9FA',           // Color de fondo suave para la página
        'darkText': '#1a202c',       // Color de texto principal oscuro
      }
    },
  },
  
  /**
   * @docstring
   * La sección 'plugins' es donde se pueden añadir extensiones de Tailwind,
   * como las de tipografía o formularios. Actualmente no se necesitan plugins
   * adicionales para la configuración actual.
   */
  plugins: [],
}