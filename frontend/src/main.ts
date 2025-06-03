import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import App   from '@/App.vue'
import '@/style.css'
import '@/services/http'

createApp(App).use(createPinia()).use(router).mount('#app')
