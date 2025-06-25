import type { GroupDTO, GroupCreateDTO, GroupOwnerDTO } from './models/Group';

const mockOwners: Record<number, GroupOwnerDTO> = {
  1: { user_id: 1, name: 'Ana Rodríguez', profile_photo_url: 'https://randomuser.me/api/portraits/women/1.jpg' },
  2: { user_id: 2, name: 'Carlos Sánchez', profile_photo_url: 'https://randomuser.me/api/portraits/men/2.jpg' },
  3: { user_id: 3, name: 'Laura Gómez', profile_photo_url: 'https://randomuser.me/api/portraits/women/3.jpg' }
};

const mockGroups: GroupDTO[] = [
  {
    group_id: 1, group_name: "Club de Debate UTP",
    group_description: "Un espacio para el diálogo, la argumentación y el pensamiento crítico.",
    group_status_id: 1, group_owner_id: 1, group_category_id: 1, group_category_name: "Académico", group_status_name: "Activo",
    member_count: 25, max_members: 30, is_member: false, has_pending_request: true,
    banner_url: "https://images.unsplash.com/photo-1587825140708-df876c15bdf4?q=80&w=2070",
    icon: "message-square", owner: mockOwners[1], creation_date: "2024-01-20T10:00:00Z"
  },
  {
    group_id: 2, group_name: "Equipo de Fútbol 'Fieras FC'",
    group_description: "El equipo oficial de fútbol de la universidad.",
    group_status_id: 1, group_owner_id: 2, group_category_id: 2, group_category_name: "Deportivo", group_status_name: "Activo",
    member_count: 18, max_members: 22, is_member: true, has_pending_request: false,
    banner_url: "https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=2070",
    icon: "swords", owner: mockOwners[2], creation_date: "2023-08-15T15:30:00Z"
  },
  {
    group_id: 3, group_name: "Círculo de Lectura 'Páginas de Tinta'",
    group_description: "Amantes de la literatura que nos reunimos mensualmente.",
    group_status_id: 1, group_owner_id: 3, group_category_id: 3, group_category_name: "Cultural", group_status_name: "Activo",
    member_count: 40, max_members: 40, is_member: false, has_pending_request: false,
    banner_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973",
    icon: "book-open", owner: mockOwners[3], creation_date: "2022-11-30T18:00:00Z"
  },
   {
    group_id: 4, group_name: "Agrupación de Robótica y Tecnología",
    group_description: "Construimos robots, programamos y competimos.",
    group_status_id: 2, group_owner_id: 1, group_category_id: 1, group_category_name: "Académico", group_status_name: "Inactivo",
    member_count: 15, max_members: 20, is_member: false, has_pending_request: false,
    banner_url: "https://images.unsplash.com/photo-1678639837929-c62f07b4696c?q=80&w=2070",
    icon: "cpu", owner: mockOwners[1], creation_date: "2023-02-10T12:00:00Z"
  },
];

class GroupDao {
    async fetchAll(): Promise<GroupDTO[]> { return mockGroups; }
    async fetchDetails(groupId: number): Promise<GroupDTO> {
        const group = mockGroups.find(g => g.group_id === groupId);
        if (!group) throw new Error("Grupo no encontrado en los datos de prueba.");
        return JSON.parse(JSON.stringify(group));
    }
    async join(groupId: number): Promise<void> {
        await new Promise(r => setTimeout(r, 1000));
        const group = mockGroups.find(g => g.group_id === groupId);
        if (group) group.has_pending_request = true;
    }
    async create(groupData: GroupCreateDTO): Promise<GroupDTO> {
        return { ...mockGroups[0], group_id: 99, ...groupData };
    }
}
export default new GroupDao();