// src/services/dao/models/Activity.ts
export interface ActivityDTO {
    activity_id: number;
    activity_name: string;
    activity_description?: string;
    max_participants?: number;
    activity_type_id: number; // Renombrado de activity_type
    activity_status_id: number; // Renombrado de activity_status
    group_id: number;
    creator_id: number;

    // --- Campos añadidos para la UI ---
    activity_datetime: string; // Fecha y hora de inicio
    location?: string;
    participants_count?: number;
    activity_type_name?: string;
    activity_status_name?: string;
}