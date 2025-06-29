/**
 * @file src/stores/useAuthStore.ts
 * @description Store de Pinia para gestionar el estado de autenticación.
 * - REFACTORIZADO: Adaptado para un flujo de autenticación basado en cookies
 * HttpOnly. Se elimina la gestión manual del token JWT del estado.
 * El estado de autenticación ahora se determina por la presencia de los
 * datos del usuario.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { defineStore } from 'pinia';
import http from '@/services/http'; 
import AuthDao from '@/services/dao/AuthDao';
import UserDao from '@/services/dao/UserDao';
import type { LoginDTO, userEnrollDTO } from '@/services/dao/models/Auth';
import type { UserDTO } from '@/services/dao/models/User';
import { router } from '@/router';

// --- SECCIÓN DE STORE ---
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as UserDTO | null,
        loading: false,
        error: null as string | null
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        async login(payload: LoginDTO) {
            this.loading = true;
            this.error = null;
            try {
                // El backend establece las cookies HttpOnly automáticamente.
                const response = await AuthDao.login(payload);

                // Asumimos que la respuesta del DAO ahora indica éxito y posiblemente devuelve datos del usuario.
                // Si la respuesta del login ya incluye el usuario, puedes asignarlo directamente:
                // this.user = response.user;
                // Si no, lo buscamos en una llamada separada:
                if (response.login_success) {
                    await this.fetchUser();
                } else {
                    throw new Error(response.message || 'Credenciales inválidas.');
                }

            } catch (err: any) {
                this.error = err.message;
                this.user = null; 
            } finally {
                this.loading = false;
            }
        },
        
        async fetchUser() {
            try {
                this.user = await UserDao.fetchProfile();
            } catch (err) {
                this.user = null;
            }
        },

        async logout() {
            this.loading = true;
            try {
                // Llama al backend para que invalide y elimine las cookies de sesión.
                await http.post('/auth/logout'); 
            } catch (error) {
                console.error("Error durante el logout:", error);
                // A pesar del error, forzamos el cierre de sesión en el frontend.
            } finally {
                this.user = null;
                this.loading = false;
                router.push({ name: 'Login' });
            }
        },
        
        async userEnroll(payload: userEnrollDTO): Promise<boolean> {
            // Lógica de registro...
            return true; 
        },
        async requestPasswordReset(email: string): Promise<boolean> {
            // Lógica de solicitud de reseteo...
            return true; 
        },
        async resetPassword(token: string, newPassword: string): Promise<boolean> {
            // Lógica para cambiar la contraseña...
            return true; //
        },
    }
});