import { defineStore } from 'pinia'
import ParticipantDao from '@/services/dao/ParticipantDao'
import type { ParticipantDTO, AttendanceStatus } from '@/services/dao/models/Participant'

export const useParticipantStore = defineStore('participant', {
    state: () => ({
        list: [] as ParticipantDTO[],
        loading: false,
        error: null as string|null
    }),
    actions: {
        async fetchByActivity(activityId: number) {
            this.loading = true; this.error = null
            try {
                this.list = await ParticipantDao.fetchByActivity(activityId)
            } catch (err:any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async register(activityId: number, userId: number) {
            this.loading = true; this.error = null
            try {
                await ParticipantDao.register(activityId, userId)
                // Después de un registro exitoso, volvemos a cargar la lista de participantes
                // para asegurar que la UI refleje el nuevo participante.
                await this.fetchByActivity(activityId)
            } catch (err:any) {
                this.error = err.message
                // Opcional: Considera relanzar el error si el componente que llama necesita manejarlo
                // throw err;
            } finally {
                this.loading = false
            }
        },
        async updateAttendance(participantId: number, status: AttendanceStatus) {
            await ParticipantDao.updateAttendance(participantId, status)
            const p = this.list.find(x=>x.participant_id===participantId)
            if (p) p.attendance_status = status
        },
        async remove(participantId: number) {
            await ParticipantDao.remove(participantId)
            this.list = this.list.filter(x=>x.participant_id!==participantId)
        }
    }
})
