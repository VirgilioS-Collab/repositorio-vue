// src/stores/useUserStore.ts
import { defineStore } from 'pinia'
import UserDao from '@/services/dao/UserDao'
import type { UserDTO, UserUpdateDTO } from '@/services/dao/models/User'

export const useUserStore = defineStore('user', {
    state: () => ({
        profile: null as UserDTO | null,
        loading: false,
        error: null as string | null
    }),
    actions: {
        async fetchProfile() {
            this.loading = true; this.error = null
            try {
                this.profile = await UserDao.fetchProfile()
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async updateProfile(payload: UserUpdateDTO) {
            this.loading = true; this.error = null
            try {
                await UserDao.updateProfile(payload)
                // refetch or merge fields:
                Object.assign(this.profile, payload)
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
    }
})
