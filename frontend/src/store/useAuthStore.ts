/**
 * @file src/stores/useAuthStore.ts
 * @description Store de Pinia para gestionar el estado de autenticación.
 * Maneja el token, perfil de usuario, y todo el flujo de autenticación,
 * incluyendo registro y recuperación de contraseña.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { defineStore } from 'pinia'
import AuthDao from '@/services/dao/AuthDao'
import type { LoginDTO, LoginResponseDTO, userEnrollDTO } from '@/services/dao/models/Auth'
import type { UserDTO } from '@/services/dao/models/User'

// --- SECCIÓN DE STORE ---
export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('jwt') || null as string | null,
        user: null as UserDTO | null,
        loading: false,
        error: null as string | null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        /**
         * @docstring
         * Realiza el proceso de inicio de sesión.
         */
        async login(payload: LoginDTO) {
            this.loading = true
            this.error = null
            try {
                const res: LoginResponseDTO = await AuthDao.login(payload)
                if (res.login_success && res.token) {
                    this.token = res.token
                    localStorage.setItem('jwt', res.token)
                    this.user = res.user as UserDTO
                } else {
                    throw new Error(res.message || 'Credenciales inválidas.')
                }
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },

        /**
         * @docstring
         * Registra un nuevo usuario en el sistema.
         * @returns {Promise<boolean>} - True si el registro fue exitoso.
         */
        async userEnroll(payload: userEnrollDTO): Promise<boolean> {
            this.loading = true
            this.error = null
            try {
                await AuthDao.UserEnroll(payload)
                return true
            } catch (err: any) {
                this.error = err.message
                return false
            } finally {
                this.loading = false
            }
        },
        
        /**
         * @docstring
         * Acción para solicitar el restablecimiento de contraseña.
         * @returns {Promise<boolean>} - True si la solicitud fue exitosa.
         */
        async requestPasswordReset(email: string): Promise<boolean> {
            this.loading = true
            this.error = null
            try {
                await AuthDao.requestPasswordReset(email)
                return true
            } catch (err: any) {
                this.error = err.message
                return false
            } finally {
                this.loading = false
            }
        },

        /**
         * @docstring
         * Acción para confirmar la nueva contraseña.
         * @returns {Promise<boolean>} - True si el cambio fue exitoso.
         */
        async resetPassword(token: string, newPassword: string): Promise<boolean> {
            this.loading = true
            this.error = null
            try {
                await AuthDao.resetPassword(token, newPassword)
                return true
            } catch (err: any) {
                this.error = err.message
                return false
            } finally {
                this.loading = false
            }
        },

        /**
         * @docstring
         * Cierra la sesión del usuario.
         */
        logout() {
            this.token = null
            this.user = null
            localStorage.removeItem('jwt')
        }
    }
})