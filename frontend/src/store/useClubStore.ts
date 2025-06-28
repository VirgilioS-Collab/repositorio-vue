/**
 * @file src/store/useClubStore.ts
 * @description Store de Pinia para gestionar el estado del club que se
 * está administrando activamente en el panel de administración.
 * - AÑADIDO: Acción 'updateSettings' para guardar los cambios del formulario.
 */
import { defineStore } from 'pinia';
import ClubDao from '@/services/dao/ClubDao';
import type { GroupDTO } from '@/services/dao/models/Group';
import type { ClubSettingsDTO } from '@/services/dao/models/Admin'; // Importamos el DTO
import { useUserStore } from './useUserStore';

export const useClubStore = defineStore('club', {
  state: () => ({
    details: null as GroupDTO | null,
    loading: false,
    error: null as string | null
  }),
  actions: {
    /**
     * @action fetchDetails
     * @description Busca los detalles de un club por su ID.
     */
    async fetchDetails(id: number) {
      this.loading = true;
      this.error = null;
      try {
        // Asumiendo que ClubDao tiene un método para esto
        this.details = await ClubDao.details(id);
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * @action updateSettings
     * @description Llama al DAO para guardar los ajustes del club.
     * @param {number} clubId - El ID del club.
     * @param {ClubSettingsDTO} payload - Los datos a actualizar.
     */
    async updateSettings(clubId: number, payload: ClubSettingsDTO) {
        this.loading = true;
        try {
            await ClubDao.updateSettings(clubId, payload);
            if (this.details) {
                Object.assign(this.details, payload);
            }
            useUserStore().showToast('Ajustes guardados exitosamente.', 'success');
        } catch(err: any) {
            useUserStore().showToast(`Error al guardar: ${err.message}`, 'error');
        } finally {
            this.loading = false;
        }
    }
  }
});