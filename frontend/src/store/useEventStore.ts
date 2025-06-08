import { defineStore } from 'pinia'
import axios from 'axios'

export interface EventDTO {
    id: number
    name: string
    date: string
    club: string
    capacity: number
    available: number
    status: string
}

export const useEventStore = defineStore('event', {
    state: () => ({
        upcoming: [] as EventDTO[],
        loading: false,
        error: '' as string | null
    }),
    actions: {
        async fetchUpcoming() {
            this.loading = true
            this.error = null
            try {
                const res = await axios.get<EventDTO[]>('/api/events/upcoming')
                this.upcoming = res.data
            } catch (err: any) {
                this.error = err.message || 'Error fetching upcoming events'
            } finally {
                this.loading = false
            }
        }
    }
})
