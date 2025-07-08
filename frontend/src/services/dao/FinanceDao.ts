/**
 * @file src/services/dao/FinanceDao.ts
 * @description Capa de Acceso a Datos para las Finanzas de un club.
 * Centraliza todas las llamadas a la API relacionadas con las finanzas.
 */
import http from '@/services/http';
import type { FinanceSummaryDTO, TransactionDTO, TransactionCreateDTO } from '@/services/dao/models/Admin';

class FinanceDao {
    /**
     * @docstring
     * Obtiene el resumen financiero (ingresos, egresos, saldo) de un club.
     * @param {number} clubId - El ID del club.
     * @returns {Promise<FinanceSummaryDTO>}
     */
    async fetchSummary(clubId: number): Promise<FinanceSummaryDTO> {
        const { data } = await http.get<FinanceSummaryDTO>(`/admin/clubs/${clubId}/finances/summary`);
        return data;
    }

    /**
     * @docstring
     * Obtiene una lista de todas las transacciones de un club.
     * @param {number} clubId - El ID del club.
     * @returns {Promise<TransactionDTO[]>}
     */
    async fetchTransactions(clubId: number): Promise<TransactionDTO[]> {
        const { data } = await http.get<TransactionDTO[]>(`/admin/clubs/${clubId}/finances/transactions`);
        return data;
    }

    /**
     * @docstring
     * Registra una nueva transacción (ingreso o egreso).
     * @param {number} clubId - El ID del club.
     * @param {TransactionCreateDTO} payload - Los datos de la transacción.
     * @returns {Promise<TransactionDTO>} La transacción recién creada.
     */
    async addTransaction(clubId: number, payload: TransactionCreateDTO): Promise<TransactionDTO> {
        const { data } = await http.post<TransactionDTO>(`/admin/clubs/${clubId}/finances/transactions`, payload);
        return data;
    }

    /**
     * @docstring
     * Actualiza una transacción existente.
     * @param {number} clubId - El ID del club.
     * @param {number} transactionId - El ID de la transacción a actualizar.
     * @param {TransactionCreateDTO} payload - Los datos actualizados de la transacción.
     * @returns {Promise<TransactionDTO>} La transacción actualizada.
     */
    async updateTransaction(clubId: number, transactionId: number, payload: TransactionCreateDTO): Promise<TransactionDTO> {
        const { data } = await http.put<TransactionDTO>(`/admin/clubs/${clubId}/finances/transactions/${transactionId}`, payload);
        return data;
    }

    /**
     * @docstring
     * Elimina una transacción.
     * @param {number} clubId - El ID del club.
     * @param {number} transactionId - El ID de la transacción a eliminar.
     * @returns {Promise<void>}
     */
    async deleteTransaction(clubId: number, transactionId: number): Promise<void> {
        await http.delete(`/admin/clubs/${clubId}/finances/transactions/${transactionId}`);
    }
}

// Exportamos una instancia de FinanceDao para que pueda ser utilizada en otros módulos
export default new FinanceDao();