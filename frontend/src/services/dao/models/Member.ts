/**
 * @file src/services/dao/models/Member.ts
 * @description DTO para los objetos de Miembro.
 * - AÑADIDO: Campos del perfil de usuario (name, email, etc.) para
 * mostrar información completa en la tabla de administración.
 */
export interface MemberDTO {
    user_id: number;
    group_id: number;
    signup_date: string;
    role_id: number;
    status_id: number;
    approved_by?: number;
    updated_at: string;

    // --- Campos adicionales para la UI de administración ---
    name: string;
    email: string;
    profile_photo_url?: string;
    role_name: string;
    status_name: string;
}

export interface MemberStatsDTO {
    active: number;
    newMembers: number;
    droppedMembers: number;
}