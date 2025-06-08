// src/services/dao/MemberDao.ts
import http from "@/services/http"
import type { MemberDTO, MemberStatsDTO } from "@/services/dao/models/Member.ts"

class MemberDao {
    async fetchAll(clubId: number): Promise<MemberDTO[]> {
        const { data } = await http.get<MemberDTO[]>(`/clubs/${clubId}/members`)
        return data
    }

    async fetchStats(clubId: number): Promise<MemberStatsDTO> {
        const { data } = await http.get<MemberStatsDTO>(`/clubs/${clubId}/members/stats`)
        return data
    }

    async inviteMany(clubId: number, emails: string[]): Promise<void> {
        await http.post(`/clubs/${clubId}/members/invite`, { emails })
    }

    async remove(clubId: number, userId: number): Promise<void> {
        await http.delete(`/clubs/${clubId}/members/${userId}`)
    }
}

export default new MemberDao()
