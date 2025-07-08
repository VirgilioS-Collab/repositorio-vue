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
  title: string;
  description: string;
  activity_type: string; // meeting, workshop, event, etc.
  status: string; // scheduled, in_progress, completed, cancelled
  group_id: number;
  group_name: string;
  created_by: number;
  created_date: string;
  max_participants?: number;
  current_participants: number;
  location?: string;
  image_url?: string;
  schedules?: ActivityScheduleDTO[];
  participants?: ActivityParticipantDTO[];
  
  // Mantener compatibilidad con la estructura anterior
  activity_name?: string;
  activity_description?: string;
  activity_datetime?: string;
  start_time?: string;
  participants_count?: number;
  activity_type_name?: string;
  activity_status_name?: string;
}

/**
 * DTO para crear una actividad
 */
export interface ActivityCreateRequestDTO {
  title: string;
  description: string;
  activity_type: string;
  group_id: number;
  max_participants?: number;
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
  title?: string;
  description?: string;
  activity_type?: string;
  max_participants?: number;
  location?: string;
  status?: string;
  image_url?: string;
}

/**
 * DTO para unirse a una actividad
 */
export interface JoinActivityRequestDTO {
  activity_id: number;
}