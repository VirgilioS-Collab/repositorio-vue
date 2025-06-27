/**
 * @file src/services/dao/models/User.ts
 * @description Define los tipos y DTOs para el modelo de Usuario.
 */
import type { GroupDTO } from './Group';
import type { ActivityDTO } from './Activity';

/**
 * @interface UserDTO
 * @description Contrato de datos completo para un objeto de Usuario.
 * El backend debe devolver este objeto en el endpoint /auth/me.
 */
export interface UserDTO {
    user_id: number;
    username: string;
    email: string;
    name: string;
    last_name: string;
    phone?: string;
    about_me?: string;
    profile_photo_url?: string | null;
    user_type: 'student' | 'admin' | 'leader'; // Tipos de usuario definidos
    user_status: 'active' | 'inactive';
    career?: string;

    // --- Datos Relacionados ---
    groups?: GroupDTO[];
    activities?: ActivityDTO[];
}

/**
 * @interface UserUpdateDTO
 * @description Define los campos que el usuario puede actualizar de su propio perfil.
 */
export interface UserUpdateDTO {
    name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    about_me?: string;
    profile_photo_url?: string;
    career?: string;
}