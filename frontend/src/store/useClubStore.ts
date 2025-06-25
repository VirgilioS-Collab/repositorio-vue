/**
 * @file src/store/useClubStore.ts
 * @description Store de Pinia para gestionar los datos del club en el panel de admin.
 * - AÑADIDO: Acción `updateDetails` para simular el guardado de los ajustes.
 */
import { defineStore } from 'pinia';
import ClubDao from '@/services/dao/ClubDao';
import type { GroupDTO } from '@/services/dao/models/Group';
import { useUserStore } from './useUserStore';

export const useClubStore = defineStore('clubAdmin', {
    state: () => ({
        details: null as GroupDTO | null,
        loading: false,
        error: null as string | null
    }),
    actions: {
        async fetchDetails(id: number) {
            this.loading = true;
            this.error = null;
            try {
                // Hacemos una copia para no mutar el mock original directamente
                this.details = JSON.parse(JSON.stringify(await ClubDao.details(id)));
            } catch (err: any) {
                this.error = err.message;
            } finally {
                this.loading = false;
            }
        },
        /**
         * @docstring
         * Simula la actualización de los detalles del club.
         * @param {number} id - El ID del club.
         * @param {GroupDTO} data - Los nuevos datos del club.
         */
        async updateDetails(id: number, data: Partial<GroupDTO>) {
            this.loading = true;
            console.log(`--- MODO PRUEBA: Guardando datos para el club ${id} ---`, data);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simula retraso de red
            
            if (this.details) {
                Object.assign(this.details, data);
            }
            useUserStore().showToast('Ajustes guardados correctamente.', 'success');
            this.loading = false;
        }
    }
});