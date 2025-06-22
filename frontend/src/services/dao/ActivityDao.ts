/**
 * @file src/services/dao/ActivityDao.ts
 * @description Capa de Acceso a Datos para las Actividades.
 * - AÑADIDO: Se crea el método `fetchById` para obtener los detalles
 * de una actividad específica.
 */
import http from '@/services/http';
import type { ActivityDTO } from '@/services/dao/models/Activity';

class ActivityDao {
    /**
     * @docstring
     * Obtiene los detalles de una actividad específica por su ID.
     * @param {number} activityId 
     * @returns {Promise<ActivityDTO>}
     */
    async fetchById(activityId: number): Promise<ActivityDTO> {
        const response = await http.get<ActivityDTO>(`/activities/${activityId}`);
        return response.data;
    }
    
    // Aquí podrían ir otros métodos como fetchAll(), create(data), etc.
}

export default new ActivityDao();