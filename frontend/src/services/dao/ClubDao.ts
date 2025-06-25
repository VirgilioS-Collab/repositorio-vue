/**
 * @file src/services/dao/ClubDao.ts
 * @description Capa de Acceso a Datos para los detalles del Club en el panel de admin.
 * - MODO PRUEBA: Simula la obtención de datos de un club.
 * - CORREGIDO: Se añade la información completa de los clubes 3 y 4 para que el
 * Dashboard del administrador muestre los datos correctos.
 */
import type { GroupDTO, GroupOwnerDTO } from './models/Group';

// Datos de propietarios para ser referenciados
const mockOwners: Record<number, GroupOwnerDTO> = {
  1: { user_id: 1, name: 'Ana Rodríguez', profile_photo_url: 'https://randomuser.me/api/portraits/women/1.jpg' },
  2: { user_id: 2, name: 'Carlos Sánchez', profile_photo_url: 'https://randomuser.me/api/portraits/men/2.jpg' },
  3: { user_id: 3, name: 'Laura Gómez', profile_photo_url: 'https://randomuser.me/api/portraits/women/3.jpg' }
};

// Datos simulados completos para todos los clubes
const mockClubs: GroupDTO[] = [
  {
    group_id: 1,
    group_name: "Club de Debate UTP",
    group_description: "Un espacio para el diálogo y el pensamiento crítico.",
    group_status_id: 1, group_owner_id: 1, owner: mockOwners[1]
  },
  {
    group_id: 2,
    group_name: "Equipo de Fútbol 'Fieras FC'",
    group_description: "El equipo oficial de fútbol de la universidad.",
    group_status_id: 1, group_owner_id: 2, owner: mockOwners[2]
  },
  {
    group_id: 3,
    group_name: "Círculo de Lectura 'Páginas de Tinta'",
    group_description: "Amantes de la literatura.",
    group_status_id: 1, group_owner_id: 3, owner: mockOwners[3]
  },
  {
    group_id: 4,
    group_name: "Agrupación de Robótica y Tecnología",
    group_description: "Construimos robots, programamos y competimos.",
    group_status_id: 2, group_owner_id: 1, owner: mockOwners[1]
  },
];


class ClubDao {
    /**
     * @docstring
     * Simula la obtención de los detalles de un club por su ID.
     */
    async details(clubId: number): Promise<GroupDTO> {
        console.log(`--- MODO PRUEBA: Buscando detalles del club ${clubId} ---`);
        await new Promise(resolve => setTimeout(resolve, 300));
        const club = mockClubs.find(c => c.group_id === clubId);
        
        if (club) {
            // Devuelve el club encontrado
            return club;
        }

        // Si no se encuentra, devuelve un club genérico para evitar errores.
        return { group_id: clubId, group_name: `Club #${clubId}`, group_status_id: 1, group_owner_id: 0 };
    }
}

export default new ClubDao();