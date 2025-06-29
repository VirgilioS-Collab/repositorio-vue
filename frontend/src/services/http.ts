/**
 * @file src/services/http.ts
 * @description Módulo centralizado de configuración de Axios.
 * - MODIFICADO: Se configura `withCredentials: true` para permitir que el
 * navegador envíe y reciba cookies HttpOnly de forma automática.
 * - ELIMINADO: Se remueve el interceptor de peticiones que adjuntaba
 * manualmente el token JWT. Esta tarea ahora la gestiona el navegador
 * de forma segura y transparente.
 */

// --- LIBRERÍAS/IMPORTS ---
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore'; 

// --- CONFIGURACIÓN DE AXIOS ---
/**
 * @docstring
 * Se crea una instancia de Axios con la URL base de la API y la configuración
 * para que maneje automáticamente las cookies de sesión.
 */
const http = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

/**
 * @docstring
 * INTERCEPTOR DE RESPUESTAS (Response Interceptor)
 * Opcional, pero altamente recomendado para un flujo de refresh automático.
 * Se ejecuta DESPUÉS de recibir una respuesta. Si detecta un error 401
 * (token de acceso expirado), intentará obtener uno nuevo usando el
 * refresh_token (que el navegador envía como cookie) y reintentará la
 * petición original.
 */
http.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // Si el error es 401 y no hemos reintentado ya esta petición
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        // Llama al endpoint que usa la refresh_token_cookie para generar un nuevo access_token_cookie
        await http.post('/auth/refresh');
        
        // El navegador habrá recibido la nueva cookie de acceso, así que reintentamos la petición original.
        return http(originalRequest);

      } catch (refreshError) {
        // Si el refresh falla (ej. refresh_token también expiró), cerramos la sesión.
        authStore.logout();
        return Promise.reject(refreshError);
      }
    }

    // Para cualquier otro error, simplemente lo propagamos.
    return Promise.reject(error);
  }
);


export default http;