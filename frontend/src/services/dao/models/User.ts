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
    last_name:         string;
    phone?:            string;
    profile_photo_url?: string | null;
    user_type:         'student' | 'admin' | 'leader';
    user_status:       'active' | 'inactive';
}

/**
 * @NUEVO
 * Representación mínima ("lean") del perfil de usuario.
 * Se utiliza en el `useAuthStore` para mantener en memoria solo los datos
 * esenciales para la UI, mejorando el rendimiento.
 */
export interface UserLeanDTO {
  user_id:   number;
  name:      string;
  user_type: 'student' | 'admin' | 'leader';
  avatar?:   string | null; // Mapeado desde 'profile_photo_url'
}