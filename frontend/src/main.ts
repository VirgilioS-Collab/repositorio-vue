import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import { useAuthStore } from '@/store/useAuthStore'
import App   from '@/App.vue'
import '@/style.css'
import '@/services/http'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(router)

// Inicializar el token desde localStorage al cargar la app
const authStore = useAuthStore()
authStore.tryLoadTokenFromStorage()

app.mount('#app')
