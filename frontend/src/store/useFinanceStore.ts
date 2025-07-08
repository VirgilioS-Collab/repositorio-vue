/**
 * @file src/store/useFinanceStore.ts
 * @description Store de Pinia para gestionar el estado financiero de un club.
 * - CORREGIDO: Se asegura de que la acción `fetchSummary` llame correctamente
 * al método 'FinanceDao.fetchSummary(clubId)' en lugar de al objeto DAO.
 */
import { defineStore } from 'pinia';
import FinanceDao from '@/services/dao/FinanceDao';
import type { FinanceSummaryDTO, TransactionDTO, TransactionCreateDTO } from '@/services/dao/models/Admin';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    /**
     * @property summary
     * @description Almacena el resumen financiero con ingresos, egresos y saldo.
     */
    summary: null as FinanceSummaryDTO | null,
    /**
     * @property transactions
     * @description Almacena la lista de transacciones del club.
     */
    transactions: [] as TransactionDTO[],
    /**
     * @property hasFunds
     * @description Indica si el club maneja un módulo de finanzas.
     */
    hasFunds: true, // Para desarrollo. En producción, esto debería venir de los datos del club.
    loading: false,
    error: null as string | null,
  }),
  getters: {
    getTransactions: (state) => state.transactions,
  },
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

    /**
     * @action fetchTransactions
     * @description Busca todas las transacciones de un club.
     * @param {number} clubId - El ID del club.
     */
    async fetchTransactions(clubId: number) {
      this.loading = true;
      this.error = null;
      try {
        this.transactions = await FinanceDao.fetchTransactions(clubId);
      } catch (err: any) {
        this.error = err.message;
        console.error("Error en fetchTransactions:", err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * @action addTransaction
     * @description Agrega una nueva transacción.
     * @param {number} clubId - El ID del club.
     * @param {TransactionCreateDTO} payload - Los datos de la transacción.
     */
    async addTransaction(clubId: number, payload: TransactionCreateDTO) {
      this.loading = true;
      this.error = null;
      try {
        const newTransaction = await FinanceDao.addTransaction(clubId, payload);
        this.transactions.push(newTransaction);
      } catch (err: any) {
        this.error = err.message;
        console.error("Error en addTransaction:", err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * @action updateTransaction
     * @description Actualiza una transacción existente.
     * @param {number} clubId - El ID del club.
     * @param {number} transactionId - El ID de la transacción a actualizar.
     * @param {TransactionCreateDTO} payload - Los datos actualizados de la transacción.
     */
    async updateTransaction(clubId: number, transactionId: number, payload: TransactionCreateDTO) {
      this.loading = true;
      this.error = null;
      try {
        const updatedTransaction = await FinanceDao.updateTransaction(clubId, transactionId, payload);
        const index = this.transactions.findIndex(t => t.id === transactionId);
        if (index !== -1) {
          this.transactions[index] = updatedTransaction;
        }
      } catch (err: any) {
        this.error = err.message;
        console.error("Error en updateTransaction:", err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * @action deleteTransaction
     * @description Elimina una transacción.
     * @param {number} clubId - El ID del club.
     * @param {number} transactionId - El ID de la transacción a eliminar.
     */
    async deleteTransaction(clubId: number, transactionId: number) {
      this.loading = true;
      this.error = null;
      try {
        await FinanceDao.deleteTransaction(clubId, transactionId);
        this.transactions = this.transactions.filter(t => t.id !== transactionId);
      } catch (err: any) {
        this.error = err.message;
        console.error("Error en deleteTransaction:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});