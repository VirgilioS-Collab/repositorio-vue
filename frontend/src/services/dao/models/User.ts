/**
 * @file src/services/dao/models/User.ts
 * @description DTOs para la entidad de Usuario, implementando la estrategia "Full + Lean".
 */

/**
 * Representación completa del perfil de usuario, tal como lo devuelve el endpoint /auth/me.
 * Este modelo refleja fielmente el contrato existente con el backend.
 */
export interface UserDTO {
  user_id:           number;
  u_username:        string;
  u_email:           string;
  u_name:            string;
  u_last_name:       string;
  u_phone?:          string;
  u_about_me?:       string;
  u_profile_photo_url?: string | null;
  u_user_type:       'student' | 'admin' | 'leader';
  u_user_status:     'active' | 'inactive';
  u_creation_date?:  string; // timestamp
  u_last_login_date?: string; // timestamp
  u_birth_date?:     string; // date
  u_document_number?: string;
  u_document_type_id?: number; // FK
  u_gender_id?:      number; // FK
  user_uuid?:        string; // uuid
  full_name?:        string; // Mantener si es una propiedad calculada en el backend
  clubs?:            any[];
  activities?:       any[];
  notifications?:    any[];
}

/**
 * @NUEVO
 * Representación mínima ("lean") del perfil de usuario.
 * Se utiliza en el `useAuthStore` para mantener en memoria solo los datos
 * esenciales para la UI, mejorando el rendimiento.
 */
export interface UserLeanDTO {
  user_id:   number;
  u_username:  string;
  u_email:     string;
  u_name:      string;
  u_last_name: string;
  u_user_type: 'student' | 'admin' | 'leader';
  avatar?:   string | null; 
}

/**
 * DTO para actualización de perfil de usuario
 */
export interface UserUpdateDTO {
  u_name?:             string;
  u_last_name?:        string;
  u_phone?:            string;
  u_about_me?:         string;
  u_profile_photo_url?: string | null;
}