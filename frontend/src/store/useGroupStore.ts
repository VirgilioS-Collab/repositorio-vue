// src/stores/useGroupStore.ts
import { defineStore } from 'pinia'
import GroupDao from '@/services/dao/GroupDao'
import type { GroupDTO } from '@/services/dao/models/Group'

export const useGroupStore = defineStore('group', {
    state: () => ({
        list: [] as GroupDTO[],
        myList: [] as GroupDTO[],
        loading: false,
        error: null as string|null
    }),
    actions: {
        async fetchAll() {
            this.loading = true; this.error = null
            try {
                this.list = await GroupDao.fetchAll()
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async join(id: number) {
            this.loading = true; this.error = null
            try {
                await GroupDao.join(id)
                // refresca mis grupos
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
    }
})
