/**
 * @file src/services/http.ts
 * @description Instancia centralizada de Axios (Singleton) con interceptor global.
 */
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import AuthDao from '@/services/dao/AuthDao';
import { router } from '@/router'; // Importa el router

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    withCredentials: true,
});

// Variable para controlar si ya estamos refrescando el token
let isRefreshing = false;
// Cola de peticiones pendientes mientras se refresca el token
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

http.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        if (authStore.accessToken) {
            config.headers.Authorization = `Bearer ${authStore.accessToken}`;
        }
        console.log('HTTP Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

http.interceptors.response.use(
    (response) => {
        console.log('HTTP Response:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const authStore = useAuthStore();

        // Si el error es 401 y no es una petición de refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marca la petición como reintentada

            if (isRefreshing) {
                // Si ya estamos refrescando, añade la petición a la cola
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return http(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true;

            return new Promise(async (resolve, reject) => {
                try {
                    const { token } = await AuthDao.refresh(); // Llama al método refresh del DAO
                    authStore.setAccessToken(token); // Actualiza el token en el store
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    processQueue(null, token); // Resuelve las peticiones en cola
                    resolve(http(originalRequest)); // Reintenta la petición original
                } catch (refreshError: any) {
                    processQueue(refreshError, null); // Rechaza las peticiones en cola
                    authStore.logout(); // Cierra la sesión en el store
                    router.push('/auth/login'); // Redirige al login
                    reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            });
        }

        console.log('HTTP Error:', error.response?.status, error.config?.url, error.message);
        return Promise.reject(error);
    }
);

export default http;