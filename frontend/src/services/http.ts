/**
 * @file src/services/http.ts
 * @description Módulo centralizado de configuración de Axios.
 * - MODIFICADO: Se añade un interceptor de peticiones para adjuntar
 * automáticamente el token JWT a todas las peticiones salientes.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import axios from 'axios';

// --- SECCIÓN PRINCIPAL ---
/**
 * @docstring
 * Se crea una instancia de Axios con la URL base de la API.
 */
const http = axios.create({
  baseURL: 'http://localhost:3000/api'
});

/**
 * @docstring
 * INTERCEPTOR DE PETICIONES (Request Interceptor)
 * Esta función se ejecuta ANTES de que cada petición sea enviada.
 * Su propósito es añadir dinámicamente el header de autorización.
 */
http.interceptors.request.use(
  (config) => {
    // 1. Obtener el token directamente desde localStorage.
    //    Hacemos esto aquí para evitar dependencias circulares, ya que
    //    el store de Pinia (useAuthStore) importa servicios que a su vez
    //    importan este archivo 'http'.
    const token = localStorage.getItem('jwt');

    // 2. Si el token existe, lo añadimos a las cabeceras de la petición.
    //    El formato 'Bearer <token>' es el estándar para JWT.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Devolvemos la configuración modificada para que la petición continúe.
    return config;
  },
  (error) => {
    // Maneja errores en la configuración de la petición.
    return Promise.reject(error);
  }
);

export default http;