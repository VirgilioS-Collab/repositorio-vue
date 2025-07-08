/**
 * @file src/services/dao/models/Club.ts
 * @description DTOs para la entidad de Club, siguiendo la estructura del backend.
 */

/**
 * Información de contacto del club
 */
export interface ClubContactInfo {
  email?: string;
  phone?: string;
  social_media?: {
    whatsapp?: string;
    telegram?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
}

/**
 * DTO completo del club
 */
export interface ClubDTO {
  club_id: number;
  g_group_name: string;
  g_group_description: string;
  g_group_category: string; // academic, recreational, sports, etc.
  g_group_status: string; // active, inactive
  g_group_owner_id?: number;
  group_uuid?: string;
  max_members?: number;
  current_members?: number;
  created_date?: string;
  leader_name?: string;
  image_url?: string;
  contact_info?: ClubContactInfo;
  has_funds?: boolean;
}

/**
 * DTO para crear un club
 */
export interface ClubCreateRequestDTO {
  g_group_name: string;
  g_group_description: string;
  g_group_category: string;
  max_members?: number;
  contact_info?: ClubContactInfo;
  image_url?: string; // Añadido para permitir la URL de la imagen
}

/**
 * DTO para actualizar un club
 */
export interface ClubUpdateRequestDTO {
  g_group_name?: string;
  g_group_description?: string;
  max_members?: number;
  contact_info?: ClubContactInfo;
  image_url?: string;
}

/**
 * DTO para miembro de club
 */
export interface ClubMemberDTO {
  user_id: number;
  username: string;
  name: string;
  last_name: string;
  profile_photo_url?: string;
  role: string; // leader, admin, member
  status: string; // active, inactive
  joined_date?: string;
}

/**
 * DTO para solicitud de unión a club
 */
export interface JoinRequestDTO {
  request_id: number;
  club_id: number;
  user_id: number;
  status: string; // pending, approved, rejected
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

/**
 * DTO para solicitar unirse a un club
 */
export interface JoinClubRequestDTO {
  club_id: number;
}

/**
 * DTO para actualizar el rol de un miembro del club
 */
export interface ClubMemberUpdateDTO {
  role?: string; // e.g., 'member', 'moderator', 'admin'
  status?: 'active' | 'inactive';
}

/**
 * DTO para invitar miembros a un club
 */
export interface ClubMemberInviteDTO {
  emails: string[];
}
