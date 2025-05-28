// src/stores/useJoinRequestStore.ts
import { defineStore } from 'pinia'
import JoinRequestDao from '@/services/dao/JoinRequestDao'
import type { JoinRequestDTO } from '@/services/dao/models/JoinRequest'

export const useJoinRequestStore = defineStore('joinRequest', {
    state: () => ({
        pending: [] as JoinRequestDTO[],
        loading: false,
        error: null as string|null
    }),
    actions: {
        async fetchPending(clubId: number) {
            this.loading = true; this.error = null
            try {
                this.pending = await JoinRequestDao.fetchPending(clubId)
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async process(requestId: number, action:'APROBAR'|'RECHAZAR') {
            this.loading = true; this.error = null
            try {
                await JoinRequestDao.process(requestId, action)
                this.pending = this.pending.filter(r=>r.request_id!==requestId)
            } catch (err:any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
    }
})
