// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

// Rutas hijas del módulo Club
const clubChildren: RouteRecordRaw[] = [
    {
        path: '',
        name: 'club-dashboard',
        component: () => import('@/views/club/Dashboard.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: 'activities',
        name: 'club-activities',
        component: () => import('@/views/club/Activities.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: 'members',
        name: 'club-members',
        component: () => import('@/views/club/Members.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: 'settings',
        name: 'club-settings',
        component: () => import('@/views/club/Settings.vue'),
        meta: { requiresAuth: true }
    }
]

const routes: RouteRecordRaw[] = [
    // Públicas
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue')
    },
    // Home (requiere auth)
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: { requiresAuth: true }
    },
    // Perfil del Club
    {
        path: '/groups/:id',
        name: 'group-profile',
        component: () => import('@/views/club/GroupProfile.vue'),
        meta: { requiresAuth: true }
    },
    // Panel de Club (usa AdminView.vue como layout)
    {
        path: '/club/:id',
        component: () => import('@/layouts/AdminView.vue'),
        children: clubChildren,
        meta: { requiresAuth: true }
    },
    // Fallback
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Guard global de autenticación
router.beforeEach((to, _from, next) => {
    const auth = useAuthStore()
    // tu store expone isAuthenticated
    if (to.meta.requiresAuth && !auth.isLogged) {
        next({ name: 'Login' })
    } else {
        next()
    }
})