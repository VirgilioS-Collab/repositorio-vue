// src/services/dao/models/Group.ts

// Interfaz para el propietario del grupo, para anidar su información
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
    
    // CAMPOS AÑADIDOS PARA SOLUCIONAR ERRORES DE TIPO
    group_category_name?: string;
    group_status_name?: string;
    member_count?: number;
    max_members?: number | null;
    is_member?: boolean;
    has_pending_request?: boolean;
    banner_url?: string;
    icon?: string;
    creation_date?: string;
    owner?: GroupOwnerDTO;
}

export interface GroupCreateDTO {
    group_name: string;
    group_description?: string;
    group_status_id: number;
    group_category_id?: number;
}