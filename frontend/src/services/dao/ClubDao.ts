import http from "@/services/http"
import type { ClubDTO, ClubUpdateDTO } from "@/services/dao/models/Club.ts"

class ClubDao {
    async fetchAll(): Promise<ClubDTO[]> {
        const { data } = await http.get<ClubDTO[]>("/clubs")
        return data
    }

    async details(clubId: number): Promise<ClubDTO> {
        const { data } = await http.get<ClubDTO>(`/clubs/${clubId}`)
        return data
    }

    async update(clubId: number, payload: ClubUpdateDTO): Promise<void> {
        await http.put(`/clubs/${clubId}`, payload)
    }
}

export default new ClubDao()
