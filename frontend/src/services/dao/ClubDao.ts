/**
 * @file src/services/dao/ClubDao.ts
 * @description Capa de Acceso a Datos para la gestión de un Club.
 * - AÑADIDO: Se añade el método `details` para obtener la información
 * de un club específico, solucionando el error en el store.
 */
import http from '@/services/http';
import type { ClubSettingsDTO } from '@/services/dao/models/Admin';
import type { GroupDTO } from '@/services/dao/models/Group'; // Reutilizamos el DTO principal

class ClubDao {
    /**
     * @docstring
     * Obtiene los detalles de un club específico por su ID.
     * @param {number} clubId - El ID del club a obtener.
     * @returns {Promise<GroupDTO>}
     */
    async details(clubId: number): Promise<GroupDTO> {
        // Asumimos que la API para los detalles de un club/grupo es esta
        const { data } = await http.get<GroupDTO>(`/groups/${clubId}`);
        return data;
    }

    /**
     * @docstring
     * Actualiza los ajustes generales de un club.
     */
    async updateSettings(clubId: number, payload: ClubSettingsDTO): Promise<void> {
        await http.put(`/admin/clubs/${clubId}/settings`, payload);
    }
}

export default new ClubDao();