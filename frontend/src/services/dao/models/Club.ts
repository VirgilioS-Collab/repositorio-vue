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
  };
}

/**
 * DTO completo del club
 */
export interface ClubDTO {
  club_id: number;
  name: string;
  description: string;
  club_type: string; // academic, recreational, sports, etc.
  status: string; // active, inactive
  max_members?: number;
  current_members: number;
  created_date?: string;
  leader_id?: number;
  leader_name?: string;
  image_url?: string;
  contact_info?: ClubContactInfo;
  has_funds?: boolean; // Añadido
}

/**
 * DTO para crear un club
 */
export interface ClubCreateRequestDTO {
  name: string;
  description: string;
  club_type: string;
  max_members?: number;
  contact_info?: ClubContactInfo;
}

/**
 * DTO para actualizar un club
 */
export interface ClubUpdateRequestDTO {
  name?: string;
  description?: string;
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
