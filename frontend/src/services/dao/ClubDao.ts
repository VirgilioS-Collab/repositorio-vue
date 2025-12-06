/**
 * @file src/services/dao/ClubDao.ts
 * @description Capa de Acceso a Datos para la gestión de un Club.
 */
import http from '@/services/http';
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
   * Obtiene la lista completa de todos los clubs disponibles.
   */
  static async fetchAll(): Promise<ClubDTO[]> {
    const response = await http.get('/api/groups');
    // El backend responde { clubs_list: [...] }
    return response.data?.clubs_list ?? [];
  }

  /**
   * Obtiene los detalles de un club específico por su ID.
   */
  static async fetchDetails(clubId: number): Promise<ClubDTO> {
    const response = await http.get<ClubDTO>(`/api/groups/${clubId}`);
    return response.data;
  }

  /**
   * Crea un nuevo club.
   */
  static async create(clubData: ClubCreateRequestDTO): Promise<ClubDTO> {
    const response = await http.post<ClubDTO>('/api/groups', clubData);
    return response.data;
  }

  /**
   * Actualiza un club existente.
   */
  static async update(clubId: number, clubData: ClubUpdateRequestDTO): Promise<ClubDTO> {
    const response = await http.put<ClubDTO>(`/api/groups/${clubId}`, clubData);
    return response.data;
  }

  /**
   * Elimina un club.
   */
  static async delete(clubId: number): Promise<void> {
    await http.delete(`/api/groups/${clubId}`);
  }

  /**
   * Obtiene los miembros de un club.
   */
  static async getMembers(clubId: number): Promise<ClubMemberDTO[]> {
    const response = await http.get<ClubMemberDTO[]>(`/api/groups/${clubId}/members`);
    return response.data;
  }

  /**
   * Solicita unirse a un club.
   */
  static async joinClub(payload: JoinClubRequestDTO): Promise<void> {
    // Backend endpoint: POST /api/groups/<club_id>/join
    await http.post(`/api/groups/${payload.club_id}/join`, payload);
  }

    static async leaveClub(payload: JoinClubRequestDTO): Promise<void> {
    // Backend endpoint: POST /api/groups/<club_id>/join
    await http.post(`/api/groups/${payload.club_id}/leave`, payload);
  }

  /**
   * Obtiene las solicitudes de unión pendientes de un club.
   */
  static async getJoinRequests(clubId: number): Promise<JoinRequestDTO[]> {
    const response = await http.get<JoinRequestDTO[]>(`/api/groups/${clubId}/join-requests`);
    return response.data;
  }

  /**
   * Aprueba o rechaza una solicitud de unión.
   */
  static async processJoinRequest(clubId: number, requestId: number, action: 'approve' | 'reject'): Promise<void> {
    await http.put(`/api/clubs/${clubId}/join-requests/${requestId}`, { action });
  }

  /**
   * Obtiene los clubs de los que es miembro el usuario autenticado.
   */
  static async getMyClubs(): Promise<ClubDTO[]> {
    const response = await http.get('/api/users/me/groups');
    // El backend responde { groups_list: [...] }
    return response.data?.groups_list ?? [];
  }

  /**
   * @docstring
   * Actualiza los ajustes generales de un club.
   */
  static async updateSettings(clubId: number, payload: ClubSettingsDTO): Promise<void> {
    await http.put(`/admin/clubs/${clubId}/settings`, payload);
  }

  /**
   * Invita a nuevos miembros a un club.
   */
  static async inviteMembers(clubId: number, payload: ClubMemberInviteDTO): Promise<void> {
    await http.post(`/api/clubs/${clubId}/members/invite`, payload);
  }

  /**
   * Actualiza el rol o estado de un miembro específico del club.
   */
  static async updateMember(clubId: number, userId: number, payload: ClubMemberUpdateDTO): Promise<void> {
    await http.put(`/api/clubs/${clubId}/members/${userId}`, payload);
  }

  /**
   * Elimina un miembro de un club.
   */
  static async removeMember(clubId: number, userId: number): Promise<void> {
    await http.delete(`/api/clubs/${clubId}/members/${userId}`);
  }
}

export default ClubDao;