import { defineStore } from 'pinia'
import ScheduleDao from '@/services/dao/ScheduleDao'
import type { ScheduleDTO } from '@/services/dao/models/Schedule'

export const useScheduleStore = defineStore('schedule', {
    state: () => ({
        list: [] as ScheduleDTO[],
        loading: false,
        error: null as string|null
    }),
    actions: {
        async fetchByActivity(activityId: number) {
            this.loading = true; this.error = null
            try {
                this.list = await ScheduleDao.fetchByActivity(activityId)
            } catch (err:any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async create(activityId: number, payload: Omit<ScheduleDTO,'schedule_id'>) {
            const id = await ScheduleDao.create(activityId, payload)
            this.list.push({ ...payload, schedule_id:id } as ScheduleDTO)
        },
        async update(id: number, payload: Partial<ScheduleDTO>) {
            await ScheduleDao.update(id, payload)
            const scheduleToUpdate = this.list.find(s => s.schedule_id === id);
            if (scheduleToUpdate) {
                Object.assign(scheduleToUpdate, payload);
            }
        },
        async remove(id: number) {
            await ScheduleDao.delete(id)
            this.list = this.list.filter(s=>s.schedule_id!==id)
        }
    }
})
