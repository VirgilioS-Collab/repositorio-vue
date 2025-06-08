// src/stores/useAuthStore.ts
import { defineStore } from 'pinia'
import AuthDao from '@/services/dao/AuthDao'
import type { LoginDTO, LoginResponseDTO } from '@/services/dao/models/Auth'
import type { UserDTO } from '@/services/dao/models/User'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null as string| null,
        user: null as UserDTO | null,
        loading: false,
        error: null as string | null
    }),
    getters: {
        isLogged: (state) => !!state.token
    },
    actions: {
        async login(payload: LoginDTO) {
            this.loading = true; this.error = null
            try {
                const res: LoginResponseDTO = await AuthDao.login(payload)
                this.token = res.token    // JWT
                if (res.user) { // Verificar si res.user está definido
                    this.user = res.user as UserDTO // Asegurar la asignación de tipo
                } else {
                    // Opcional: Manejar el caso donde res.user es undefined.
                    // Podrías, por ejemplo, llamar a fetchProfile o establecer un estado de error.
                    console.warn("Información del usuario no recibida en la respuesta de login.");
                    // this.user = null; // o alguna lógica de fallback
                }
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async fetchProfile() {
            if (!this.token) return
            this.loading = true; this.error = null
            try {
                const profile = await AuthDao.me()
                this.user = profile
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async logout() {
            await AuthDao.logout()
            this.token = null
            this.user  = null
        },
        async refreshToken() {
            try {
                const { token } = await AuthDao.refresh()
                this.token = token
            } catch { /* no interrumpir UI */ }
        }
    }
})
