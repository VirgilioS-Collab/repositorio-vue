/**
 * @file src/services/dao/ActivityDao.ts
 * @description DAO para las operaciones de la API relacionadas con las actividades.
 */
import http from '@/services/http';
import type { 
  ActivityDTO, 
  ActivityCreateRequestDTO, 
  ActivityUpdateRequestDTO,
  JoinActivityRequestDTO,
  ActivityEnrollmentStatsDTO
} from '@/services/dao/models/Activity';

class ActivityDao {
    /**
     * Obtiene la lista de todas las actividades públicas.
     */
    static async fetchAll(options?: { signal?: AbortSignal }): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>('/api/activities', options);
        return data;
    }

    /**
     * Obtiene los detalles de una actividad específica por su ID.
     */
    static async fetchById(id: number, options?: { signal?: AbortSignal }): Promise<ActivityDTO> {
        const { data } = await http.get<ActivityDTO>(`/api/activities/${id}`, options);
        return data;
    }

    /**
     * Crea una nueva actividad.
     */
    static async create(clubId: number, activityData: ActivityCreateRequestDTO): Promise<ActivityDTO> {
        const { data } = await http.post<ActivityDTO>(`/api/clubs/${clubId}/activities`, activityData);
        return data;
    }

    /**
     * Actualiza una actividad existente.
     */
    static async update(id: number, activityData: ActivityUpdateRequestDTO): Promise<ActivityDTO> {
        const { data } = await http.put<ActivityDTO>(`/api/activities/${id}`, activityData);
        return data;
    }

    /**
     * Elimina una actividad.
     */
    static async delete(id: number): Promise<void> {
        await http.delete(`/api/activities/${id}`);
    }

    /**
     * Se une a una actividad.
     */
    static async join(payload: JoinActivityRequestDTO): Promise<void> {
        await http.post(`/api/activities/${payload.activity_id}/participants`, payload);
    }

    /**
     * Se retira de una actividad.
     */
    static async leave(activityId: number): Promise<void> {
        await http.delete(`/api/activities/${activityId}/participants/me`);
    }

    /**
     * Obtiene las próximas actividades para el usuario autenticado.
     */
    static async getNextForMe(options?: { signal?: AbortSignal }): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>('/api/users/me/activities?next=true', options);
        return data;
    }

    /**
     * Obtiene todas las actividades del usuario autenticado.
     */
    static async getMyActivities(options?: { signal?: AbortSignal }): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>('/api/users/me/activities', options);
        return data;
    }

    /**
     * Obtiene las actividades de un club específico.
     */
    static async getByGroup(clubId: number, options?: { signal?: AbortSignal }): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>(`/api/clubs/${clubId}/activities`, options);
        return data;
    }

    /**
     * Obtiene estadísticas de inscripciones de actividades para un club específico.
     */
    static async fetchEnrollmentStats(clubId: number): Promise<ActivityEnrollmentStatsDTO[]> {
        const { data } = await http.get<ActivityEnrollmentStatsDTO[]>(`/api/clubs/${clubId}/activity-enrollment-stats`);
        return data;
    }
}

export default ActivityDao;