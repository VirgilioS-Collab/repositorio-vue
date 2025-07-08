/**
 * @file src/services/http.ts
 * @description Instancia centralizada de Axios (Singleton) con interceptor global.
 */
import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    withCredentials: true,
});

// Interceptor simple por ahora - sin manejo de auth para debugging
http.interceptors.request.use(
    (config) => {
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
    (error) => {
        console.log('HTTP Error:', error.response?.status, error.config?.url, error.message);
        return Promise.reject(error);
    }
);

export default http;