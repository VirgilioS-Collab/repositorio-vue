/**
 * @file src/services/dao/ActivityDao.ts
 * @description Capa de Acceso a Datos para las Actividades.
 * Centraliza todas las llamadas a la API relacionadas con actividades.
 */
import http from '@/services/http';
import type { ActivityDTO, ActivityCreateDTO, ActivityUpdateDTO } from '@/services/dao/models/Activity';

class ActivityDao {
    /**
     * @docstring
     * Obtiene la lista completa de todas las actividades disponibles (para estudiantes).
     * @returns {Promise<ActivityDTO[]>}
     */
    async fetchAll(): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>('/activities');
        return data;
    }

    /**
     * @docstring
     * Obtiene los detalles de una actividad específica por su ID.
     * @param {number} activityId - El ID de la actividad.
     * @returns {Promise<ActivityDTO>}
     */
    async fetchById(activityId: number): Promise<ActivityDTO> {
        const { data } = await http.get<ActivityDTO>(`/activities/${activityId}`);
        return data;
    }
    
    /**
     * @docstring
     * Obtiene las actividades organizadas por un grupo específico.
     * @param {number} groupId - El ID del grupo.
     * @returns {Promise<ActivityDTO[]>}
     */
    async fetchByGroup(groupId: number): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>(`/groups/${groupId}/activities`);
        return data;
    }
    
    /**
     * @docstring
     * Obtiene todas las actividades de un club para el panel de administración.
     * @param {number} clubId - El ID del club que se está administrando.
     * @returns {Promise<ActivityDTO[]>}
     */
    async fetchAllForAdmin(clubId: number): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>(`/admin/clubs/${clubId}/activities`);
        return data;
    }

    /**
     * @docstring
     * Crea una nueva actividad para un club.
     * @param {number} clubId - El ID del club.
     * @param {ActivityCreateDTO} payload - Los datos de la nueva actividad.
     * @returns {Promise<ActivityDTO>} La actividad recién creada.
     */
    async create(clubId: number, payload: ActivityCreateDTO): Promise<ActivityDTO> {
        const { data } = await http.post<ActivityDTO>(`/admin/clubs/${clubId}/activities`, payload);
        return data;
    }

    /**
     * @docstring
     * Actualiza una actividad existente.
     * @param {number} activityId - El ID de la actividad a actualizar.
     * @param {ActivityUpdateDTO} payload - Los nuevos datos de la actividad.
     * @returns {Promise<ActivityDTO>} La actividad actualizada.
     */
    async update(activityId: number, payload: ActivityUpdateDTO): Promise<ActivityDTO> {
        const { data } = await http.put<ActivityDTO>(`/admin/activities/${activityId}`, payload);
        return data;
    }

    /**
     * @docstring
     * Elimina una actividad.
     * @param {number} activityId - El ID de la actividad a eliminar.
     * @returns {Promise<void>}
     */
    async delete(activityId: number): Promise<void> {
        await http.delete(`/admin/activities/${activityId}`);
    }
}

export default new ActivityDao();