import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView      from '@/views/HomeView.vue'
// AdminView     from '@/views/AdminView.vue'
//import LoginView     from '@/views/LoginView.vue'

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: DefaultLayout,
            children: [
                { path: '',      name: 'home',  component: HomeView },
            ],
        },

    ],
})
