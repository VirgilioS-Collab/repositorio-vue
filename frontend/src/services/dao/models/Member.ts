export interface MemberDTO {
    user_id: number;
    group_id: number;
    signup_date: string;
    role_id: number;
    status_id: number;
    approved_by?: number;
    updated_at: string;
    // --- Campos añadidos para la UI ---
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