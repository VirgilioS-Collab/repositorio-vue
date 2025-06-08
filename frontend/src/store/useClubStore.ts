// src/stores/useClubStore.ts
import { defineStore } from 'pinia'
import ClubDao from '@/services/dao/ClubDao'
import type { ClubDTO, ClubUpdateDTO } from '@/services/dao/models/Club'

export const useClubStore = defineStore('club', {
    state: () => ({
        list: [] as ClubDTO[],
        details: null as ClubDTO | null,
        loading: false,
        error: null as string | null
    }),
    actions: {
        async fetchAll() {
            this.loading = true; this.error = null
            try {
                this.list = await ClubDao.fetchAll()
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async fetchDetails(id: number) {
            this.loading = true; this.error = null
            try {
                this.details = await ClubDao.details(id)
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async updateClub(id: number, payload: ClubUpdateDTO) {
            this.loading = true; this.error = null
            try {
                await ClubDao.update(id, payload)
                Object.assign(this.details, payload)
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
    }
})
