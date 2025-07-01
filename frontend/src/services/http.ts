/**
 * @file src/services/http.ts
 * @description Instancia centralizada de Axios (Singleton) con interceptor global.
 * Maneja automáticamente la autenticación basada en cookies y el refresco de sesión.
 */
import axios, { type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Interfaz para extender la configuración de Axios con una bandera de reintento.
interface RetryableRequest extends AxiosRequestConfig {
  _retry?: boolean;
}

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true, // Permite el envío de cookies HttpOnly en cada petición.
});

/**
 * Interceptor de respuestas para manejar la expiración de sesión (401).
 */
http.interceptors.response.use(
    // Para respuestas exitosas (2xx), no hace nada y las deja pasar.
    (response) => response,

    // Para respuestas con error, ejecuta esta lógica.
    async (error) => {
        const originalRequest = error.config as RetryableRequest;

        // Si el error es 401 (No Autorizado) y no es un reintento, se intenta refrescar el token.
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marca la petición para evitar bucles infinitos de reintentos.

            try {
                // Se llama al endpoint de refresh. El backend usará la cookie 'refresh_token'
                // para emitir un nuevo 'access_token' (también como cookie).
                await http.post('/auth/refresh');
                
                // Si el refresh fue exitoso, se reintenta la petición original con la nueva cookie.
                return http(originalRequest);

            } catch (refreshError) {
                // Si el refresh falla, la sesión es irrecuperable.
                // Se llama a la acción de logout para limpiar el estado y redirigir.
                // Se usa un import dinámico o se llama directamente para evitar dependencias circulares.
                useAuthStore().logout();
                return Promise.reject(refreshError);
            }
        }
        
        // Para cualquier otro error, simplemente se propaga.
        return Promise.reject(error);
    }
);

export default http;