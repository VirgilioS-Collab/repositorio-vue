// src/services/dao/JoinRequestDao.ts
import http from "@/services/http"
import type { JoinRequestDTO } from "@/services/dao/models/JoinRequest.ts"

class JoinRequestDao {
    async fetchPending(groupId: number): Promise<JoinRequestDTO[]> {
        const { data } = await http.get<JoinRequestDTO[]>(
            `/groups/${groupId}/join-requests`
        )
        return data
    }

    async process(requestId: number, action: "APROBAR" | "RECHAZAR"): Promise<void> {
        await http.post(`/join-requests/${requestId}/process`, { action })
    }
}

export default new JoinRequestDao()
