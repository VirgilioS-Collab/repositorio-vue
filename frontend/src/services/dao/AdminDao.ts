/**
 * @file src/services/dao/AdminDao.ts
 * @description DAO para las operaciones del Panel de Administración.
 * Implementa todos los endpoints de administración según la especificación del backend.
 */
import http from '@/services/http';
import {
  API_ADMIN_CLUBS_ACTIVITIES,
  API_ADMIN_CLUBS_SETTINGS,
  API_ADMIN_CLUBS_MEMBERS_STATS,
  API_ADMIN_CLUBS_MEMBERS_LIST,
  API_ADMIN_CLUBS_ACTIVITIES_HEATMAP,
  API_ADMIN_CLUBS_ACTIVITIES_ENROLLMENTS,
  API_ADMIN_CLUBS_JOIN_REQUESTS,
  API_ADMIN_CLUBS_JOIN_REQUEST_BY_ID,
  API_ADMIN_CLUBS_MEMBERS_EXPORT,
  API_ADMIN_ACTIVITIES_BY_ID
} from '@/constants/api';

// Importar tipos necesarios
import type { ActivityDTO, ActivityCreateRequestDTO, ActivityUpdateRequestDTO } from '@/services/dao/models/Activity';
import type { ClubSettingsDTO } from '@/services/dao/models/Admin';

// Interfaces para estadísticas y datos de administración
export interface MemberStatsDTO {
  total_members: number;
  active_members: number;
  inactive_members: number;
  new_members_this_month: number;
  members_by_role: {
    [role: string]: number;
  };
}

export interface ClubMemberDTO {
  user_id: number;
  username: string;
  name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  joined_date: string;
  profile_photo_url?: string;
}

export interface WeeklyHeatmapDTO {
  date: string;
  activity_count: number;
  day_of_week: number;
  week_of_year: number;
}

export interface ActivityEnrollmentDTO {
  activity_id: number;
  activity_name: string;
  total_enrollments: number;
  max_capacity?: number;
  enrollment_percentage: number;
}

export interface JoinRequestDTO {
  request_id: number;
  club_id: number;
  user_id: number;
  status: string;
  request_date: string;
  processed_date?: string;
  processed_by?: number;
  user_info?: {
    username: string;
    name: string;
    last_name: string;
    profile_photo_url?: string;
  };
}

export interface JoinRequestActionDTO {
  action: 'Aprobado' | 'Rechazado';
}

class AdminDao {
  /**
   * Obtiene las actividades del club para administradores.
   * GET /api/admin/clubs/{clubId}/activities
   */
  static async getClubActivities(clubId: number, options?: { signal?: AbortSignal }): Promise<ActivityDTO[]> {
    const { data } = await http.get<ActivityDTO[]>(API_ADMIN_CLUBS_ACTIVITIES(clubId), options);
    return data;
  }

  /**
   * Crea una nueva actividad en el club.
   * POST /api/admin/clubs/{clubId}/activities
   */
  static async createActivity(clubId: number, activityData: ActivityCreateRequestDTO): Promise<ActivityDTO> {
    const { data } = await http.post<ActivityDTO>(API_ADMIN_CLUBS_ACTIVITIES(clubId), activityData);
    return data;
  }

  /**
   * Actualiza una actividad existente.
   * PUT /api/admin/activities/{activityId}
   */
  static async updateActivity(activityId: number, activityData: ActivityUpdateRequestDTO): Promise<ActivityDTO> {
    const { data } = await http.put<ActivityDTO>(API_ADMIN_ACTIVITIES_BY_ID(activityId), activityData);
    return data;
  }

  /**
   * Cancela/elimina una actividad.
   * DELETE /api/admin/activities/{activityId}
   */
  static async deleteActivity(activityId: number): Promise<void> {
    await http.delete(API_ADMIN_ACTIVITIES_BY_ID(activityId));
  }

  /**
   * Actualiza los ajustes generales del club.
   * PUT /api/admin/clubs/{clubId}/settings
   */
  static async updateClubSettings(clubId: number, settings: ClubSettingsDTO): Promise<void> {
    await http.put(API_ADMIN_CLUBS_SETTINGS(clubId), settings);
  }

  /**
   * Obtiene estadísticas de miembros del club.
   * GET /api/admin/clubs/{clubId}/members/stats
   */
  static async getMemberStats(clubId: number, options?: { signal?: AbortSignal }): Promise<MemberStatsDTO> {
    const { data } = await http.get<MemberStatsDTO>(API_ADMIN_CLUBS_MEMBERS_STATS(clubId), options);
    return data;
  }

  /**
   * Obtiene la lista completa de miembros del club.
   * GET /api/admin/clubs/{clubId}/members/list
   */
  static async getMembersList(clubId: number, options?: { signal?: AbortSignal }): Promise<ClubMemberDTO[]> {
    const { data } = await http.get<ClubMemberDTO[]>(API_ADMIN_CLUBS_MEMBERS_LIST(clubId), options);
    return data;
  }

  /**
   * Obtiene el heatmap semanal de actividades.
   * GET /api/admin/clubs/{clubId}/activities/weekly-heatmap
   */
  static async getWeeklyHeatmap(clubId: number, options?: { signal?: AbortSignal }): Promise<WeeklyHeatmapDTO[]> {
    const { data } = await http.get<WeeklyHeatmapDTO[]>(API_ADMIN_CLUBS_ACTIVITIES_HEATMAP(clubId), options);
    return data;
  }

  /**
   * Obtiene estadísticas de inscripciones por actividad.
   * GET /api/admin/clubs/{clubId}/activities/enrollments
   */
  static async getActivityEnrollments(clubId: number, options?: { signal?: AbortSignal }): Promise<ActivityEnrollmentDTO[]> {
    const { data } = await http.get<ActivityEnrollmentDTO[]>(API_ADMIN_CLUBS_ACTIVITIES_ENROLLMENTS(clubId), options);
    return data;
  }

  /**
   * Obtiene las solicitudes de unión pendientes.
   * GET /api/admin/clubs/{clubId}/join-requests
   */
  static async getJoinRequests(clubId: number, options?: { signal?: AbortSignal }): Promise<JoinRequestDTO[]> {
    const { data } = await http.get<JoinRequestDTO[]>(API_ADMIN_CLUBS_JOIN_REQUESTS(clubId), options);
    return data;
  }

  /**
   * Aprueba o rechaza una solicitud de unión.
   * PUT /api/admin/clubs/{clubId}/join-requests/{requestId}
   */
  static async processJoinRequest(
    clubId: number, 
    requestId: number, 
    action: JoinRequestActionDTO
  ): Promise<void> {
    await http.put(API_ADMIN_CLUBS_JOIN_REQUEST_BY_ID(clubId, requestId), action);
  }

  /**
   * Exporta la lista de miembros en formato CSV.
   * GET /api/admin/clubs/{clubId}/members/export
   */
  static async exportMembers(clubId: number): Promise<Blob> {
    const response = await http.get(API_ADMIN_CLUBS_MEMBERS_EXPORT(clubId), {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv'
      }
    });
    return response.data;
  }
}

export default AdminDao;
