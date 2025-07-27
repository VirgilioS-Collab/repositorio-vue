/**
 * @file src/services/dao/ActivityDao.ts
 * @description DAO para las operaciones de la API relacionadas con las actividades.
 */
import http from '@/services/http';
import { 
  API_ACTIVITIES,
  API_ACTIVITIES_BY_ID,
  API_GROUPS_ACTIVITIES,
  API_ADMIN_CLUBS_ACTIVITIES,
  API_ADMIN_ACTIVITIES_BY_ID,
  API_USER_ME_ACTIVITIES,
  API_USER_ME_ACTIVITY_JOIN,
  API_USER_ME_ACTIVITY_LEAVE,
  API_ADMIN_CLUBS_ACTIVITIES_ENROLLMENTS
} from '@/constants/api';
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
        const { data } = await http.get<ActivityDTO[]>(API_ACTIVITIES, options);
        return data;
    }

    /**
     * Obtiene los detalles de una actividad específica por su ID.
     */
    static async fetchById(id: number, options?: { signal?: AbortSignal }): Promise<ActivityDTO> {
        const { data } = await http.get<ActivityDTO>(API_ACTIVITIES_BY_ID(id), options);
        return data;
    }

    /**
     * Crea una nueva actividad (ADMIN).
     */
    static async create(clubId: number, activityData: ActivityCreateRequestDTO): Promise<ActivityDTO> {
        const { data } = await http.post<ActivityDTO>(API_ADMIN_CLUBS_ACTIVITIES(clubId), activityData);
        return data;
    }

    /**
     * Actualiza una actividad existente (ADMIN).
     */
    static async update(id: number, activityData: ActivityUpdateRequestDTO): Promise<ActivityDTO> {
        const { data } = await http.put<ActivityDTO>(API_ADMIN_ACTIVITIES_BY_ID(id), activityData);
        return data;
    }

    /**
     * Elimina una actividad (ADMIN).
     */
    static async delete(id: number): Promise<void> {
        await http.delete(API_ADMIN_ACTIVITIES_BY_ID(id));
    }

    /**
     * Se une a una actividad.
     */
    static async join(payload: JoinActivityRequestDTO): Promise<void> {
        await http.post(API_USER_ME_ACTIVITY_JOIN(payload.activity_id), payload);
    }

    /**
     * Se retira de una actividad.
     */
    static async leave(activityId: number): Promise<void> {
        await http.put(API_USER_ME_ACTIVITY_LEAVE(activityId));
    }

    /**
     * Obtiene las próximas actividades para el usuario autenticado.
     */
    static async getNextForMe(options?: { signal?: AbortSignal }): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>(`${API_USER_ME_ACTIVITIES}?next=true`, options);
        return data;
    }

    /**
     * Obtiene todas las actividades del usuario autenticado.
     */
    static async getMyActivities(options?: { signal?: AbortSignal }): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>(API_USER_ME_ACTIVITIES, options);
        return data;
    }

    /**
     * Obtiene las actividades de un grupo específico.
     */
    static async getByGroup(groupId: number, options?: { signal?: AbortSignal }): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>(API_GROUPS_ACTIVITIES(groupId), options);
        return data;
    }

    /**
     * Obtiene estadísticas de inscripciones de actividades para un club específico.
     */
    static async fetchEnrollmentStats(clubId: number): Promise<ActivityEnrollmentStatsDTO[]> {
        const { data } = await http.get<ActivityEnrollmentStatsDTO[]>(API_ADMIN_CLUBS_ACTIVITIES_ENROLLMENTS(clubId));
        return data;
    }
}

export default ActivityDao;