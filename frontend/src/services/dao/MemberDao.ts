/**
 * @file src/services/dao/MemberDao.ts
 * @description Capa de Acceso a Datos para los Miembros de un club.
 * Actualizado para usar los endpoints correctos de administración.
 */
import http from "@/services/http";
import { 
  API_ADMIN_CLUBS_MEMBERS_LIST, 
  API_ADMIN_CLUBS_MEMBERS_STATS, 
  API_ADMIN_CLUBS_MEMBERS_EXPORT 
} from '@/constants/api';
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
     * Obtiene una lista de miembros para el panel de admin.
     * GET /api/admin/clubs/{clubId}/members/list
     */
    async fetchAllForAdmin(clubId: number, params?: AdminMemberListParams): Promise<PaginatedMembersResponse> {
        const { data } = await http.get<PaginatedMembersResponse>(API_ADMIN_CLUBS_MEMBERS_LIST(clubId), { params });
        return data;
    }

    /**
     * Obtiene las estadísticas de miembros para el dashboard.
     * GET /api/admin/clubs/{clubId}/members/stats
     */
    async fetchStats(clubId: number): Promise<MemberStatsDTO> {
        const { data } = await http.get<MemberStatsDTO>(API_ADMIN_CLUBS_MEMBERS_STATS(clubId));
        return data;
    }

    /**
     * Llama a la API para invitar nuevos miembros por correo.
     */
    async inviteMany(clubId: number, emails: string[]): Promise<void> {
        await http.post(`/api/groups/${clubId}/members/invite`, { emails });
    }

    /**
     * Solicita al servidor la generación de un archivo CSV con los miembros.
     * GET /api/admin/clubs/{clubId}/members/export
     */
    async exportCsv(clubId: number): Promise<Blob> {
        const response = await http.get(API_ADMIN_CLUBS_MEMBERS_EXPORT(clubId), {
            responseType: 'blob',
        });
        return response.data;
    }
}

export default new MemberDao();