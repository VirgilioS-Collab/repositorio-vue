/**
 * @file src/router/index.ts
 * @description Enrutador principal de la aplicación Vue.
 * Define todas las rutas públicas y privadas, y gestiona la
 * protección de rutas mediante un guard de navegación para producción.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/useAuthStore';
import AdminView from '@/layouts/AdminView.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

// --- SECCIÓN DE CONSTANTES ---
/**
 * @docstring
 * Define las rutas hijas para el panel de administración del club,
 * que se renderizarán dentro del layout AdminView.
 */
const clubChildren: RouteRecordRaw[] = [
  { path: '', name: 'Dashboard', component: () => import('@/views/club/Dashboard.vue') },
  { path: 'members', name: 'Members', component: () => import('@/views/club/Members.vue') },
  { path: 'activities', name: 'Activities', component: () => import('@/views/club/Activities.vue') },
  { path: 'settings', name: 'Settings', component: () => import('@/views/club/Settings.vue') }
];

/**
 * @docstring
 * Arreglo principal que contiene todas las definiciones de rutas de la aplicación.
 */
const routes: RouteRecordRaw[] = [
    // --- Rutas Públicas de Autenticación (Sin layout principal) ---
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/RegistrationView.vue')
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/auth/ForgotPasswordView.vue')
    },
    {
        path: '/reset-password/:token',
        name: 'ResetPassword',
        component: () => import('@/views/auth/ResetPasswordView.vue'),
        props: true 
    },
    
    // --- Ruta Padre con Layout por Defecto para el Estudiante ---
    {
        path: '/',
        component: DefaultLayout, // Este layout se aplicará a todas sus rutas hijas
        // false indica que no requiere autenticación, cambio a true en rutas protegidas cuando se implemente la autenticación con JWT 
        meta: { requiresAuth: false },
        children: [
            {
                path: '', // La ruta raíz (/) renderiza HomeView dentro del DefaultLayout
                name: 'Home',
                component: () => import('@/views/user/HomeView.vue'),
            },
            {
                path: 'groups', // Ruta para el listado de grupos (/groups)
                name: 'GroupList',
                component: () => import('@/views/user/GroupListView.vue'),
            },
            {
                path: 'activities', // Ruta para el listado de actividades (/activities)
                name: 'ActivityList',
                component: () => import('@/views/user/ActivityListView.vue'),
            },
            {
                path: 'groups/:id', // RUTA: para el detalle de un grupo
                name: 'GroupDetail',
                component: () => import('@/views/user/GroupDetailView.vue'),
                props: true
            },
            {
                path: 'activities/:id', // RUTA: para el detalle de una actividad
                name: 'ActivityDetail',
                component: () => import('@/views/user/ActivityDetailView.vue'),
                props: true
            }
        ]
    },

    // --- Rutas de Administración del Club ---
    {
    path: '/club/:id',
    component: AdminView,
    children: clubChildren,
    // CAMBIA ESTA LÍNEA TEMPORALMENTE
    meta: { requiresAuth: false } // Originalmente era 'true'
    },
    // --- Ruta Fallback (404) ---
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

// --- SECCIÓN PRINCIPAL: Creación de la Instancia del Router ---
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

/**
 * @docstring
 * Guard de navegación global (Navigation Guard). Se ejecuta antes de cada cambio de ruta.
 * Es el mecanismo de seguridad principal del frontend.
 * Verifica si la ruta destino requiere autenticación (`meta.requiresAuth`).
 * Si es así y el usuario no está autenticado, lo redirige forzosamente a la página de Login.
 */
router.beforeEach((to, _from, next) => { 
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next({ name: 'Login' });
    } else {
        next();
    }
});