import http from '@/services/http';
import type { ActivityDTO } from '@/services/dao/models/Activity';

class ActivityDao {
    async fetchAll(): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>('/activities');
        return data;
    }

    async fetchById(activityId: number): Promise<ActivityDTO> {
        const { data } = await http.get<ActivityDTO>(`/activities/${activityId}`);
        return data;
    }

    async fetchByGroup(groupId: number): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>(`/groups/${groupId}/activities`);
        return data;
    }

    async enroll(activityId: number): Promise<void> {
        await http.post(`/activities/${activityId}/enroll`);
    }
}

export default new ActivityDao();