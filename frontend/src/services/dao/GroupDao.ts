/**
 * @file src/services/dao/GroupDao.ts
 * @description Capa de Acceso a Datos para los Grupos.
 * - MODIFICADO: Se renombra el método `fetchById` a `fetchDetails` para
 * mayor claridad y consistencia con lo que la vista espera.
 */
import http from '@/services/http';
import type { GroupDTO, GroupCreateDTO } from '@/services/dao/models/Group';

class GroupDao {
    /**
     * @docstring
     * Obtiene la lista completa de todos los grupos disponibles.
     */
    async fetchAll(): Promise<GroupDTO[]> {
        const response = await http.get<GroupDTO[]>('/groups');
        return response.data;
    }

    /**
     * @docstring
     * (MODIFICADO) Obtiene los detalles de un grupo específico por su ID.
     * @param {number} groupId - El ID del grupo a obtener.
     * @returns {Promise<GroupDTO>}
     */
    async fetchDetails(groupId: number): Promise<GroupDTO> {
        // Asumimos que el endpoint para un grupo específico sigue el patrón RESTful.
        const response = await http.get<GroupDTO>(`/groups/${groupId}`);
        return response.data;
    }

    /**
     * @docstring
     * Crea un nuevo grupo.
     */
    async create(groupData: GroupCreateDTO): Promise<GroupDTO> {
        const response = await http.post<GroupDTO>('/groups', groupData);
        return response.data;
    }
}

export default new GroupDao();