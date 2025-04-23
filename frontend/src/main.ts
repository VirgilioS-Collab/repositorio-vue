import { createApp } from 'vue';
import App from './App.vue';
import { createIcons } from 'lucide';

// Crear la aplicación Vue
const app = createApp(App);

// Montar la aplicación
app.mount('#app');

// Inicializar los iconos de Lucide
createIcons();