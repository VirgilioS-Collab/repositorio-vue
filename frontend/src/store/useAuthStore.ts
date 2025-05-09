import { defineStore } from 'pinia'
import { ref } from 'vue'
//import HttpClient from '@/api/httpClient'      // singleton

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false)
    const loading         = ref(false)

    async function login(email: string, password: string) {
        loading.value = true
        try {
            /* TODO: sustituir por llamada real */
            await new Promise(r => setTimeout(r, 1200))
            if (email !== 'admin@utp.ac.pa' || password !== '12345678') {
                throw new Error('Credenciales incorrectas')
            }
            isAuthenticated.value = true
        } finally {
            loading.value = false
        }
    }

    function logout() { isAuthenticated.value = false }

    return { isAuthenticated, loading, login, logout }
})
