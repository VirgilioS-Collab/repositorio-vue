// src/services/dao/ParticipantDao.ts
import http from "@/services/http"
import type {
    ParticipantDTO,
    AttendanceStatus
} from "@/services/dao/models/Participant.ts"

class ParticipantDao {
    async fetchByActivity(activityId: number): Promise<ParticipantDTO[]> {
        const { data } = await http.get<ParticipantDTO[]>(
            `/activities/${activityId}/participants`
        )
        return data
    }

    async register(activityId: number, userId: number): Promise<number> {
        const { data } = await http.post<{ participant_id: number }>(
            `/activities/${activityId}/participants`,
            { user_id: userId }
        )
        return data.participant_id
    }

    async updateAttendance(
        participantId: number,
        status: AttendanceStatus
    ): Promise<void> {
        await http.put(`/participants/${participantId}`, {
            attendance_status: status
        })
    }

    async remove(participantId: number): Promise<void> {
        await http.delete(`/participants/${participantId}`)
    }
}

export default new ParticipantDao()
