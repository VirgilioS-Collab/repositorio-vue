// src/stores/useActivityStore.ts
import { defineStore } from 'pinia'
import ActivityDao from '@/services/dao/ActivityDao'
import ParticipantDao from '@/services/dao/ParticipantDao'
import type { ActivityDTO } from '@/services/dao/models/Activity'

export const useActivityStore = defineStore('activity', {
    state: () => ({
        items: [] as ActivityDTO[],
        selected: null as ActivityDTO | null,
        loading: false,
        error: null as string | null,
        filters: {
            type: null as string|null,
            status: null as string|null,
            dateFrom: null as string|null,
            dateTo: null as string|null,
            keyword: ''
        }
    }),
    actions: {
        /** RF3.1–RF3.3 */
        async fetchAll(clubId: number) {
            this.loading = true; this.error = null
            try {
                this.items = await ActivityDao.fetchAll(clubId)
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        /** RF3.4 */
        async fetchById(id: number) {
            // Si tu endpoint lo soporta
            this.selected = this.items.find(a => a.activity_id === id) || null
        },
        /** RF3.4 Inscribir/Cancelar */
        async register(activityId: number, userId: number) {
            this.loading = true; this.error = null
            try {
                const participantId = await ParticipantDao.register(activityId, userId)
                return participantId
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async create(clubId: number, payload: Partial<ActivityDTO>) {
            const newId = await ActivityDao.create(clubId, payload)
            payload.activity_id = newId
            this.items.push(payload as ActivityDTO)
        },
        async update(id: number, payload: Partial<ActivityDTO>) {
            await ActivityDao.update(id, payload)
            Object.assign(this.items.find(a=>a.activity_id===id), payload)
        },
        async remove(id: number) {
            await ActivityDao.delete(id)
            this.items = this.items.filter(a=>a.activity_id!==id)
        }
    }
})
