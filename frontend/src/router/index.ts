/**
 * @file src/router/index.ts
 * @description Enrutador principal de la aplicación Vue.
 * - MODIFICADO: Se añade la propiedad `meta.title` a las rutas del panel de
 * administración para pasar dinámicamente el título al layout.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/useAuthStore';
import AdminView from '@/layouts/AdminView.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

// --- SECCIÓN DE CONSTANTES ---
const clubChildren: RouteRecordRaw[] = [
  { path: '', name: 'club-dashboard', component: () => import('@/views/club/Dashboard.vue'), meta: { title: 'Dashboard' } },
  { path: 'members', name: 'club-members', component: () => import('@/views/club/Members.vue'), meta: { title: 'Gestión de Miembros' } },
  { path: 'activities', name: 'club-activities', component: () => import('@/views/club/Activities.vue'), meta: { title: 'Actividades' } },
  { path: 'settings', name: 'club-settings', component: () => import('@/views/club/Settings.vue'), meta: { title: 'Ajustes del Club' } }
];

const routes: RouteRecordRaw[] = [
    // --- Rutas Públicas de Autenticación (Sin layout principal) ---
    { path: '/login', name: 'Login', component: () => import('@/views/auth/LoginView.vue') },
    { path: '/register', name: 'Register', component: () => import('@/views/auth/RegistrationView.vue') },
    { path: '/forgot-password', name: 'ForgotPassword', component: () => import('@/views/auth/ForgotPasswordView.vue') },
    { path: '/reset-password/:token', name: 'ResetPassword', component: () => import('@/views/auth/ResetPasswordView.vue'), props: true },
    
    // --- Ruta Padre con Layout por Defecto ---
    {
        path: '/',
        component: DefaultLayout,
        meta: { requiresAuth: true },
        children: [
            { path: '', name: 'Home', component: () => import('@/views/HomeView.vue') },
            { path: 'groups', name: 'GroupList', component: () => import('@/views/GroupListView.vue') },
            { path: 'activities', name: 'ActivityList', component: () => import('@/views/ActivityListView.vue') },
            { path: 'groups/:id', name: 'GroupDetail', component: () => import('@/views/GroupDetailView.vue'), props: true },
            { path: 'activities/:id', name: 'ActivityDetail', component: () => import('@/views/ActivityDetailView.vue'), props: true }
        ]
    },

    // --- Rutas de Administración del Club ---
    { path: '/club/:id', component: AdminView, children: clubChildren, meta: { requiresAuth: true } },

    // --- Ruta Fallback (404) ---
    { path: '/:pathMatch(.*)*', redirect: '/' }
];

// --- SECCIÓN PRINCIPAL: Creación de la Instancia del Router ---
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

router.beforeEach((to, _from, next) => {
    const auth = useAuthStore();
    
    if (!auth.isAuthenticated && localStorage.getItem('jwt')) {
        auth.initializeFromToken();
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } });
    } else {
        next();
    }
});