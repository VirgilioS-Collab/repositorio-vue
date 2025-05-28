// src/services/dao/GroupDao.ts
import http from "@/services/http"
import type { GroupDTO, GroupCreateDTO } from "@/services/dao/models/Group.ts"

class GroupDao {
    async fetchAll(): Promise<GroupDTO[]> {
        const { data } = await http.get<GroupDTO[]>("/groups")
        return data
    }

    async fetchById(groupId: number): Promise<GroupDTO> {
        const { data } = await http.get<GroupDTO>(`/groups/${groupId}`)
        return data
    }

    async create(payload: GroupCreateDTO): Promise<number> {
        const { data } = await http.post<{ group_id: number }>("/groups", payload)
        return data.group_id
    }

    async update(groupId: number, payload: Partial<GroupDTO>): Promise<void> {
        await http.put(`/groups/${groupId}`, payload)
    }

    async delete(groupId: number): Promise<void> {
        await http.delete(`/groups/${groupId}`)
    }

    async join(groupId: number): Promise<void> {
        await http.post(`/groups/${groupId}/join`)
    }
}

export default new GroupDao()
