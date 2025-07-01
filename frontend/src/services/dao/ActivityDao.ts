/**
 * @file src/services/dao/ActivityDao.ts
 * @description DAO para las operaciones de la API relacionadas con las actividades.
 * - REFACTORIZADO: Utiliza la instancia 'http' y sus métodos aceptan un AbortSignal.
 */
import http from '@/services/http';
import type { ActivityDTO } from '@/services/dao/models/Activity';

class ActivityDao {
    /**
     * Obtiene la lista de todas las actividades públicas.
     */
    async fetchAll(options?: { signal?: AbortSignal }): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>('/activities', options);
        return data;
    }

    /**
     * Obtiene los detalles de una actividad específica por su ID.
     */
    async fetchById(id: number, options?: { signal?: AbortSignal }): Promise<ActivityDTO> {
        const { data } = await http.get<ActivityDTO>(`/activities/${id}`, options);
        return data;
    }

    /**
     * Obtiene las próximas actividades para el usuario autenticado.
     */
    async getNextForMe(options?: { signal?: AbortSignal }): Promise<ActivityDTO[]> {
        const { data } = await http.get<ActivityDTO[]>('/users/me/activities?next=true', options);
        return data;
    }
}

// Se exporta una única instancia para seguir el patrón Singleton[cite: 122].
export default new ActivityDao();