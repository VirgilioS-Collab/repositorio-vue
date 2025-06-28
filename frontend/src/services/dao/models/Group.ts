/**
 * @file src/services/dao/models/Group.ts
 * @description Define la interfaz (DTO) para los objetos de Grupo.
 * Esta es la estructura de datos que el backend debe devolver para un grupo.
 */

/**
 * @interface GroupOwnerDTO
 * @description Define la estructura para la información anidada del propietario de un grupo.
 */
export interface GroupOwnerDTO {
    user_id: number;
    name: string;
    profile_photo_url?: string;
}

export interface GroupDTO {
    group_id: number;
    group_name: string;
    group_description?: string;
    group_status_id: number;
    group_owner_id: number;
    group_category_id?: number;

    // --- CAMPOS ADICIONALES PARA LA UI ---
    // El backend debe proveer estos campos para una experiencia de usuario rica.
    group_category_name?: string;
    group_status_name?: string;
    member_count?: number;
    max_members?: number | null;
    is_member?: boolean;
    has_pending_request?: boolean;
    banner_url?: string;
    logo_url?: string; // Usado en Settings.vue
    icon?: string;
    creation_date?: string; // Formato ISO "YYYY-MM-DDTHH:MM:SSZ"
    owner?: GroupOwnerDTO; // Objeto anidado con la info del propietario
}

/**
 * @type GroupCreateDTO
 * @description Define el payload necesario para crear un nuevo grupo.
 */
export type GroupCreateDTO = Omit<GroupDTO, 'group_id' | 'owner'>;