// src/services/dao/models/Activity.ts
export interface ActivityDTO {
    activity_id: number
    activity_name: string
    activity_description?: string
    max_participants?: number
    activity_type: number
    activity_status: number
    group_id: number
    creator_id: number
}
