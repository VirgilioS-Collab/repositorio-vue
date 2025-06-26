import http from '@/services/http';
import type { GroupDTO, GroupCreateDTO } from '@/services/dao/models/Group';

class GroupDao {
    async fetchAll(): Promise<GroupDTO[]> {
        const { data } = await http.get<GroupDTO[]>('/groups');
        return data;
    }

    async fetchDetails(groupId: number): Promise<GroupDTO> {
        const { data } = await http.get<GroupDTO>(`/groups/${groupId}`);
        return data;
    }

    async join(groupId: number): Promise<void> {
        await http.post(`/groups/${groupId}/join`);
    }

    async create(groupData: GroupCreateDTO): Promise<GroupDTO> {
        const { data } = await http.post<GroupDTO>('/groups', groupData);
        return data;
    }
}

export default new GroupDao();