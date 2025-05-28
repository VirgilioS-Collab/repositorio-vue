// src/services/dao/models/Schedule.ts
export interface ScheduleDTO {
    schedule_id: number
    activity_id: number
    activity_start_date: string
    activity_end_date?: string
    activity_location?: string
}
