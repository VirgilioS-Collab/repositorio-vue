// src/services/dao/models/Participant.ts
export type AttendanceStatus =
    | "Registrado"
    | "Asistió"
    | "Ausente"
    | "Justificado"

export interface ParticipantDTO {
    participant_id: number
    user_id: number
    activity_id: number
    registration_date: string
    attendance_status: AttendanceStatus
}
