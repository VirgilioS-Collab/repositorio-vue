/**
 * @file src/services/dao/models/Activity.ts
 * @description DTOs para la entidad de Actividad.
 */

/**
 * DTO para horario de actividad
 */
export interface ActivityScheduleDTO {
  schedule_id: number;
  activity_id: number;
  start_date: string;
  end_date: string;
  status: string; // scheduled, in_progress, completed, cancelled
}

/**
 * DTO para participante de actividad
 */
export interface ActivityParticipantDTO {
  user_id: number;
  username: string;
  name: string;
  last_name: string;
  participation_date: string;
  profile_photo_url?: string;
  status: string; // enrolled, attended, absent
}

/**
 * DTO completo de actividad
 */
export interface ActivityDTO {
  activity_id: number;
  ga_activity_name: string;
  ga_activity_description: string;
  ga_activity_type: string; // meeting, workshop, event, etc.
  ga_activity_status: string; // scheduled, in_progress, completed, cancelled
  ga_group_id: number;
  ga_creator_id: number;
  activity_uuid?: string;
  ga_max_participants?: number;
  group_name?: string;
  created_date?: string;
  current_participants?: number;
  location?: string;
  image_url?: string;
  schedules?: ActivityScheduleDTO[];
  participants?: ActivityParticipantDTO[];
}

/**
 * DTO para crear una actividad
 */
export interface ActivityCreateRequestDTO {
  ga_activity_name: string;
  ga_activity_description: string;
  ga_activity_type: string;
  ga_group_id: number;
  ga_max_participants?: number;
  location?: string;
  schedules?: {
    start_date: string;
    end_date: string;
  }[];
}

/**
 * DTO para actualizar una actividad
 */
export interface ActivityUpdateRequestDTO {
  ga_activity_name?: string;
  ga_activity_description?: string;
  ga_activity_type?: string;
  ga_max_participants?: number;
  ga_activity_status?: string;
  location?: string;
  image_url?: string;
}

/**
 * DTO para unirse a una actividad
 */
export interface JoinActivityRequestDTO {
  activity_id: number;
}