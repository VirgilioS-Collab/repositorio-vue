/**
 * @file src/services/dao/models/User.ts
 * @description DTOs para la entidad de Usuario, implementando la estrategia "Full + Lean".
 */

/**
 * Representación completa del perfil de usuario, tal como lo devuelve el endpoint /auth/me.
 * Este modelo refleja fielmente el contrato existente con el backend.
 */
export interface UserDTO {
  about_me: string | null;
  birth_date: string | null;         
  career: string | null;             
  doc_number: string | null;
  doc_type: string | null;
  email: string;
  gender: string | null;            
  last_name: string;
  name: string;
  phone: string | null;
  profile_photo_url: string | null;
  user_status: string;               
  user_type: string;                  
  username: string;
  avatar?: string | null;              
}



export interface UserUpdateDTO {
  u_name?:             string;
  u_last_name?:        string;
  u_phone?:            string;
  u_about_me?:         string;
  u_profile_photo_url?: string | null;
}