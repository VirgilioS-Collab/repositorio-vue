/**
 * @file src/services/dao/ClubDao.ts
 * @description Capa de Acceso a Datos para la gestión de un Club.
 */
import http from '@/services/http';
import {
  API_GROUPS,
  API_GROUPS_BY_ID,
  API_GROUPS_JOIN,
  API_GROUPS_PHOTO,
  API_USERS_ME_GROUPS,
  API_ADMIN_CLUBS_SETTINGS
} from '@/constants/api';
import type {
  ClubSettingsDTO
} from '@/services/dao/models/Admin';
import type {
  ClubDTO,
  ClubCreateRequestDTO,
  ClubUpdateRequestDTO,
  ClubMemberDTO,
  JoinRequestDTO,
  JoinClubRequestDTO,
  ClubMemberInviteDTO,
  ClubMemberUpdateDTO
} from '@/services/dao/models/Club';

class ClubDao {
  /**
   * Obtiene la lista completa de todos los grupos disponibles.
   */
  static async fetchAll(): Promise<ClubDTO[]> {
    const response = await http.get<ClubDTO[]>(API_GROUPS);
    return response.data;
  }

  /**
   * Obtiene los detalles de un grupo específico por su ID.
   */
  static async fetchDetails(groupId: number): Promise<ClubDTO> {
    const response = await http.get<ClubDTO>(API_GROUPS_BY_ID(groupId));
    return response.data;
  }

  /**
   * Crea un nuevo grupo.
   */
  static async create(groupData: ClubCreateRequestDTO): Promise<ClubDTO> {
    const response = await http.post<ClubDTO>(API_GROUPS, groupData);
    return response.data;
  }

  /**
   * Actualiza un grupo existente.
   */
  static async update(groupId: number, groupData: ClubUpdateRequestDTO): Promise<ClubDTO> {
    const response = await http.put<ClubDTO>(API_GROUPS_BY_ID(groupId), groupData);
    return response.data;
  }

  /**
   * Elimina un grupo.
   */
  static async delete(groupId: number): Promise<void> {
    await http.delete(API_GROUPS_BY_ID(groupId));
  }

  /**
   * Obtiene los miembros de un grupo.
   */
  static async getMembers(groupId: number): Promise<ClubMemberDTO[]> {
    const response = await http.get<ClubMemberDTO[]>(`${API_GROUPS_BY_ID(groupId)}/members`);
    return response.data;
  }

  /**
   * Solicita unirse a un grupo.
   */
  static async requestJoin(payload: JoinClubRequestDTO): Promise<void> {
    await http.post(API_GROUPS_JOIN(payload.club_id), payload);
  }

  /**
   * Obtiene las solicitudes de unión pendientes de un grupo.
   */
  static async getJoinRequests(groupId: number): Promise<JoinRequestDTO[]> {
    const response = await http.get<JoinRequestDTO[]>(`${API_GROUPS_BY_ID(groupId)}/join-requests`);
    return response.data;
  }

  /**
   * Aprueba o rechaza una solicitud de unión.
   */
  static async processJoinRequest(groupId: number, requestId: number, action: 'approve' | 'reject'): Promise<void> {
    await http.put(`${API_GROUPS_BY_ID(groupId)}/join-requests/${requestId}`, { action });
  }

  /**
   * Obtiene los grupos de los que es miembro el usuario autenticado.
   */
  static async getMyClubs(): Promise<ClubDTO[]> {
    const response = await http.get<ClubDTO[]>(API_USERS_ME_GROUPS);
    return response.data;
  }

  /**
   * Actualiza los ajustes generales de un club (ADMIN).
   */
  static async updateSettings(clubId: number, payload: ClubSettingsDTO): Promise<void> {
    await http.put(API_ADMIN_CLUBS_SETTINGS(clubId), payload);
  }

  /**
   * Actualiza la foto de un grupo.
   */
  static async updatePhoto(groupId: number, photoFile: File): Promise<ClubDTO> {
    const formData = new FormData();
    formData.append('photo', photoFile);
    const response = await http.put<ClubDTO>(API_GROUPS_PHOTO(groupId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  /**
   * Invita a nuevos miembros a un grupo.
   */
  static async inviteMembers(groupId: number, payload: ClubMemberInviteDTO): Promise<void> {
    await http.post(`${API_GROUPS_BY_ID(groupId)}/members/invite`, payload);
  }

  /**
   * Actualiza el rol o estado de un miembro específico del grupo.
   */
  static async updateMember(groupId: number, userId: number, payload: ClubMemberUpdateDTO): Promise<void> {
    await http.put(`${API_GROUPS_BY_ID(groupId)}/members/${userId}`, payload);
  }

  /**
   * Elimina un miembro de un grupo.
   */
  static async removeMember(groupId: number, userId: number): Promise<void> {
    await http.delete(`${API_GROUPS_BY_ID(groupId)}/members/${userId}`);
  }
}

export default ClubDao;