import http from "@/services/http"
import type { MemberDTO } from "@/services/dao/models/Member.ts"

interface PaginatedMembersResponse {
    data: MemberDTO[];
    total: number;
}

class MemberDao {
    async fetchAll(clubId: number, params: Record<string, any>): Promise<PaginatedMembersResponse> {
        const { data } = await http.get<PaginatedMembersResponse>(`/groups/${clubId}/members`, { params });
        return data;
    }

    async fetchStats(clubId: number): Promise<any> {
        const { data } = await http.get(`/groups/${clubId}/members/stats`);
        return data;
    }

    async inviteMany(clubId: number, emails: string[]): Promise<void> {
        await http.post(`/groups/${clubId}/members/invite`, { emails });
    }

    async exportToCSV(clubId: number): Promise<Blob> {
        const { data } = await http.get(`/groups/${clubId}/members/export`, {
            responseType: 'blob',
        });
        return data;
    }
}

export default new MemberDao();