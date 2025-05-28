// src/services/dao/ScheduleDao.ts
import http from "@/services/http"
import type { ScheduleDTO } from "@/services/dao/models/Schedule.ts"

class ScheduleDao {
    async fetchByActivity(activityId: number): Promise<ScheduleDTO[]> {
        const { data } = await http.get<ScheduleDTO[]>(
            `/activities/${activityId}/schedule`
        )
        return data
    }

    async create(
        activityId: number,
        payload: Omit<ScheduleDTO, "schedule_id">
    ): Promise<number> {
        const { data } = await http.post<{ schedule_id: number }>(
            `/activities/${activityId}/schedule`,
            payload
        )
        return data.schedule_id
    }

    async update(scheduleId: number, payload: Partial<ScheduleDTO>): Promise<void> {
        await http.put(`/schedule/${scheduleId}`, payload)
    }

    async delete(scheduleId: number): Promise<void> {
        await http.delete(`/schedule/${scheduleId}`)
    }
}

export default new ScheduleDao()
