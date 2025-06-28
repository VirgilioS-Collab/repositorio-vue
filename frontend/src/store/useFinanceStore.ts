/**
 * @file src/store/useFinanceStore.ts
 * @description Store de Pinia para gestionar el estado financiero de un club.
 * - CORREGIDO: Se asegura de que la acción `fetchSummary` llame correctamente
 * al método 'FinanceDao.fetchSummary(clubId)' en lugar de al objeto DAO.
 */
import { defineStore } from 'pinia';
import FinanceDao from '@/services/dao/FinanceDao';
import type { FinanceSummaryDTO } from '@/services/dao/models/Admin';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    /**
     * @property summary
     * @description Almacena el resumen financiero con ingresos, egresos y saldo.
     */
    summary: null as FinanceSummaryDTO | null,
    /**
     * @property hasFunds
     * @description Indica si el club maneja un módulo de finanzas.
     */
    hasFunds: true, // Para desarrollo. En producción, esto debería venir de los datos del club.
    loading: false,
    error: null as string | null,
  }),
  actions: {
    /**
     * @action fetchSummary
     * @description Busca el resumen financiero de un club a través del DAO.
     * @param {number} clubId - El ID del club.
     */
    async fetchSummary(clubId: number) {
      this.loading = true;
      this.error = null;
      try {
        // Aseguramos que estamos llamando al método fetchSummary del DAO.
        this.summary = await FinanceDao.fetchSummary(clubId);
      } catch (err: any) {
        this.error = err.message;
        console.error("Error en fetchSummary:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});