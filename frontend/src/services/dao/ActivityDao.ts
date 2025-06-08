// src/services/dao/ActivityDao.ts
import http from "@/services/http"
import type { ActivityDTO } from "@/services/dao/models/Activity.ts"

class ActivityDao {
    async fetchAll(clubId: number): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>(`/clubs/${clubId}/activities`)
        return data
    }

    async create(clubId: number, payload: Partial<ActivityDTO>): Promise<number> {
        const { data } = await http.post<{ activity_id: number }>(
            `/clubs/${clubId}/activities`,
            payload
        )
        return data.activity_id
    }

    async update(activityId: number, payload: Partial<ActivityDTO>): Promise<void> {
        await http.put(`/activities/${activityId}`, payload)
    }

    async delete(activityId: number): Promise<void> {
        await http.delete(`/activities/${activityId}`)
    }
}

export default new ActivityDao()
