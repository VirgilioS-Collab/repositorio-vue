import { defineStore } from 'pinia'
import axios from 'axios'

export interface FinanceFlow {
    months: string[]
    incomes: number[]
    expenses: number[]
}

export const useFinanceStore = defineStore('finance', {
    state: () => ({
        flow: {
            months: [],
            incomes: [],
            expenses: []
        } as FinanceFlow,
        loading: false,
        error: '' as string | null
    }),
    getters: {
        hasFunds: (state) => state.flow.incomes.length > 0
    },
    actions: {
        async fetchFlow() {
            this.loading = true
            this.error = null
            try {
                const res = await axios.get<FinanceFlow>('/api/finance/flow')
                this.flow = res.data
            } catch (err: any) {
                this.error = err.message || 'Error fetching finance flow'
            } finally {
                this.loading = false
            }
        }
    }
})
