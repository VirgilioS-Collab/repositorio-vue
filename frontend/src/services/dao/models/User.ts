/**
 * @file src/services/dao/models/User.ts
 * @description Define los tipos y interfaces (DTOs) para el modelo de Usuario.
 * - MODIFICADO: Se añade la propiedad opcional 'career' a las interfaces
 * UserDTO y UserUpdateDTO para alinear el modelo de datos con los
 * requerimientos de la interfaz de usuario.
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
    // AÑADIDO: Hacemos 'career' una propiedad oficial del usuario.
    career?: string; 
}

export interface UserUpdateDTO {
    name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    about_me?: string;
    profile_photo_url?: string;
    // AÑADIDO: También permitimos que 'career' sea actualizable.
    career?: string;
}