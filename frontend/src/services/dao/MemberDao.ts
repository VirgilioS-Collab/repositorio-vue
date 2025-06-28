/**
 * @file src/services/dao/MemberDao.ts
 * @description Capa de Acceso a Datos para los Miembros de un club.
 * - AÑADIDO: Métodos `fetchAllForAdmin` y `exportCsv` para la gestión
 * desde el panel de administración.
 */
import http from "@/services/http";
import type { MemberDTO, MemberStatsDTO } from "@/services/dao/models/Member.ts";

interface PaginatedMembersResponse {
    members: MemberDTO[];
    total: number;
}

interface AdminMemberListParams {
    page: number;
    limit: number;
    query?: string;
    role?: string;
    status?: string;
}

class MemberDao {
    /**
     * @docstring
     * Obtiene una lista paginada y filtrada de miembros para el panel de admin.
     */
    async fetchAllForAdmin(clubId: number, params: AdminMemberListParams): Promise<PaginatedMembersResponse> {
        const { data } = await http.get<PaginatedMembersResponse>(`/admin/clubs/${clubId}/members`, { params });
        return data;
    }

    /**
     * @docstring
     * Obtiene las estadísticas de miembros para el dashboard.
     */
    async fetchStats(clubId: number): Promise<MemberStatsDTO> {
        const { data } = await http.get<MemberStatsDTO>(`/admin/clubs/${clubId}/members/stats`);
        return data;
    }

    /**
     * @docstring
     * Llama a la API para invitar nuevos miembros por correo.
     */
    async inviteMany(clubId: number, emails: string[]): Promise<void> {
        await http.post(`/admin/clubs/${clubId}/members/invite`, { emails });
    }

    /**
     * @docstring
     * Solicita al servidor la generación de un archivo CSV con los miembros.
     */
    async exportCsv(clubId: number): Promise<Blob> {
        const response = await http.get(`/admin/clubs/${clubId}/members/export`, {
            responseType: 'blob',
        });
        return response.data;
    }
}

export default new MemberDao();