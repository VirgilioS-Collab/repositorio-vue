/**
 * @file src/router/index.ts
 * @description Enrutador principal de la aplicación Vue.
 * Define todas las rutas públicas y privadas, y gestiona la
 * protección de rutas mediante un guard de navegación para producción.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { createRouter, createWebHistory, type RouteRecordRaw, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/store/useAuthStore';
import AdminView from '@/layouts/AdminView.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { PATH_LOGIN, NAME_LOGIN, PATH_REGISTER, NAME_REGISTER, PATH_FORGOT_PASSWORD, NAME_FORGOT_PASSWORD, PATH_RESET_PASSWORD, NAME_RESET_PASSWORD, PATH_ROOT, NAME_HOME, PATH_CLUBS, NAME_CLUB_LIST, PATH_ACTIVITIES, NAME_ACTIVITY_LIST, PATH_CLUB_DETAIL, NAME_CLUB_DETAIL as NAME_CLUB_DETAIL_ROUTE, PATH_ACTIVITY_DETAIL, NAME_ACTIVITY_DETAIL as NAME_ACTIVITY_DETAIL_ROUTE, PATH_ADMIN_CLUB, NAME_DASHBOARD, NAME_MEMBERS, NAME_ACTIVITIES, NAME_FINANCE, NAME_SETTINGS, PATH_NOT_FOUND } from '@/constants/routes';

// --- SECCIÓN DE CONSTANTES ---
/**
 * @docstring
 * Define las rutas hijas para el panel de administración del club,
 * que se renderizarán dentro del layout AdminView.
 */
const clubChildren: RouteRecordRaw[] = [
  { path: '', name: NAME_DASHBOARD, component: () => import('@/views/club/Dashboard.vue') },
  { path: 'members', name: NAME_MEMBERS, component: () => import('@/views/club/Members.vue') },
  { path: 'activities', name: NAME_ACTIVITIES, component: () => import('@/views/club/Activities.vue') },
  { path: 'finance', name: NAME_FINANCE, component: () => import('@/views/club/FinanceView.vue') },
  { path: 'settings', name: NAME_SETTINGS, component: () => import('@/views/club/Settings.vue') }
];

/**
 * @docstring
 * Arreglo principal que contiene todas las definiciones de rutas de la aplicación.
 */
const routes: RouteRecordRaw[] = [
    // --- Rutas Públicas de Autenticación (Sin layout principal) ---
    {
        path: PATH_LOGIN,
        name: NAME_LOGIN,
        component: () => import('@/views/auth/LoginView.vue')
    },
    {
        path: PATH_REGISTER,
        name: NAME_REGISTER,
        component: () => import('@/views/auth/RegistrationView.vue')
    },
    {
        path: PATH_FORGOT_PASSWORD,
        name: NAME_FORGOT_PASSWORD,
        component: () => import('@/views/auth/ForgotPasswordView.vue')
    },
    {
        path: PATH_RESET_PASSWORD,
        name: NAME_RESET_PASSWORD,
        component: () => import('@/views/auth/ResetPasswordView.vue'),
        props: true 
    },
    
    // --- Ruta Padre con Layout por Defecto para el Estudiante ---
    {
        path: PATH_ROOT,
        component: DefaultLayout, // Este layout se aplicará a todas sus rutas hijas
        // false indica que no requiere autenticación, cambio a true en rutas protegidas cuando se implemente la autenticación con JWT 
        meta: { requiresAuth: false },
        children: [
            {
                path: PATH_ROOT, // La ruta raíz (/) renderiza HomeView dentro del DefaultLayout
                name: NAME_HOME,
                component: () => import('@/views/user/HomeView.vue'),
            },
            {
                path: PATH_CLUBS, // Ruta para el listado de clubs (/clubs)
                name: NAME_CLUB_LIST,
                component: () => import('@/views/user/ClubListView.vue'),
            },
            {
                path: PATH_ACTIVITIES, // Ruta para el listado de actividades (/activities)
                name: NAME_ACTIVITY_LIST,
                component: () => import('@/views/user/ActivityListView.vue'),
            },
            {
                path: PATH_CLUB_DETAIL, // RUTA: para el detalle de un club
                name: NAME_CLUB_DETAIL_ROUTE,
                component: () => import('@/views/user/ClubDetailView.vue'),
                props: true
            },
            {
                path: PATH_ACTIVITY_DETAIL, // RUTA: para el detalle de una actividad
                name: NAME_ACTIVITY_DETAIL_ROUTE,
                component: () => import('@/views/user/ActivityDetailView.vue'),
                props: true
            }
        ]
    },

    // --- Rutas de Administración del Club ---
    {
    path: PATH_ADMIN_CLUB,
    component: AdminView,
    children: clubChildren,
    // CAMBIA ESTA LÍNEA TEMPORALMENTE
    meta: { requiresAuth: true } // Originalmente era 'true'
    },
    // --- Ruta Fallback (404) ---
    {
        path: PATH_NOT_FOUND,
        component: NotFoundView
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
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => { 
    const auth = useAuthStore();

    // Lógica de autenticación para PRODUCCIÓN:
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirige al login.
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next({ name: NAME_LOGIN });
    } else {
        next();
    }

    // --- PARA DESARROLLO (DESCOMENTAR PARA DESHABILITAR AUTENTICACIÓN) ---
    // Si necesitas deshabilitar temporalmente la autenticación para desarrollo,
    // comenta el bloque 'if/else' de arriba y descomenta la siguiente línea:
    // next();
    // --- FIN: PARA DESARROLLO ---
});