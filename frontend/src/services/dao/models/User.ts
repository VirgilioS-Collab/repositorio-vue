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
  username:          string;
  email:             string;
  name:              string;
  full_name?:        string; // Añadido
  last_name:         string;
  phone?:            string;
  profile_photo_url?: string | null;
  user_type:         'student' | 'admin' | 'leader';
  user_status:       'active' | 'inactive';
  about_me?:         string;
  career?:           string;
  clubs?:            any[]; // Cambiado de groups a clubs
  activities?:       any[];
  notifications?:    any[]; // Añadido
}

/**
 * @NUEVO
 * Representación mínima ("lean") del perfil de usuario.
 * Se utiliza en el `useAuthStore` para mantener en memoria solo los datos
 * esenciales para la UI, mejorando el rendimiento.
 */
export interface UserLeanDTO {
  user_id:   number;
  username:  string;
  email:     string;
  name:      string;
  last_name: string;
  user_type: 'student' | 'admin' | 'leader';
  avatar?:   string | null; 
}

/**
 * DTO para actualización de perfil de usuario
 */
export interface UserUpdateDTO {
  name?:             string;
  last_name?:        string;
  phone?:            string;
  about_me?:         string;
  career?:           string;
  profile_photo_url?: string | null;
}