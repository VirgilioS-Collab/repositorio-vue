/**
 * @file src/services/dao/models/User.ts
 * @description Define los tipos y interfaces (DTOs) para el modelo de Usuario.
 * - MODIFICADO: Se añade la propiedad opcional 'career'.
 * - MODIFICADO: Se añaden role_id y status_id para alinear con el token/backend.
 */
import type { GroupDTO } from './Group';
import type { ActivityDTO } from './Activity';

export interface UserDTO {
    user_id: number;
    username: string;
    email: string;
    name: string;
    last_name: string;
    phone?: string;
    about_me?: string;
    profile_photo_url?: string | null;
    user_type: string;
    user_status: string;
    groups?: GroupDTO[];
    activities?: ActivityDTO[];
    career?: string;
    
    // --- CAMPOS AÑADIDOS PARA CORREGIR ERRORES ---
    role_id?: number;
    status_id?: number;
}

export interface UserUpdateDTO {
    name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    about_me?: string;
    profile_photo_url?: string;
    career?: string;
}