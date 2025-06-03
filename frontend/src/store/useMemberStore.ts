// src/stores/useMemberStore.ts
import { defineStore } from 'pinia'
import MemberDao from '@/services/dao/MemberDao'
import type { MemberDTO, MemberStatsDTO } from '@/services/dao/models/Member'

export const useMemberStore = defineStore('member', {
    state: () => ({
        items: [] as MemberDTO[],
        stats: { active:0, newMembers:0, droppedMembers:0 } as MemberStatsDTO,
        loading: false,
        error: null as string | null,
        page: 1,
        pageSize: 20,
        total: 0,
        filters: {} as Record<string, any>
    }),
    actions: {
        /** RF5.2.1 */
        async fetchAll(clubId: number) {
            this.loading = true; this.error = null
            try {
                this.items = await MemberDao.fetchAll(clubId)
                // total podría venir en headers o en un endpoint stats aparte
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        /** RF5.2.1 */
        async fetchStats(clubId: number) {
            this.loading = true; this.error = null
            try {
                this.stats = await MemberDao.fetchStats(clubId)
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        /** RF5.2.2 */
        async inviteMany(clubId: number, emails: string[]) {
            this.loading = true; this.error = null
            try {
                await MemberDao.inviteMany(clubId, emails)
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        /** RF5.2.2 */
        async remove(clubId: number, userId: number) {
            this.loading = true; this.error = null
            try {
                await MemberDao.remove(clubId, userId)
                this.items = this.items.filter(m => m.user_id !== userId)
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
        // aquí podrías agregar acciones para activate/deactivate, changeRole y exportCSV según RF5.2.2–5.2.3
    }
})
