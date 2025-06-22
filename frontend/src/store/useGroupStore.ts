/**
 * @file src/store/useGroupStore.ts
 * @description Store de Pinia para gestionar el estado de los grupos.
 * - AÑADIDO: Estado 'details' para almacenar los datos de un grupo individual.
 * - AÑADIDO: Acción `fetchDetails` para buscar un grupo por ID.
 */
import { defineStore } from 'pinia';
import GroupDao from '@/services/dao/GroupDao';
import type { GroupDTO } from '@/services/dao/models/Group';

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [] as GroupDTO[],
    // AÑADIDO: Para guardar los datos del grupo que se está viendo en detalle.
    details: null as GroupDTO | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAllGroups() {
      this.loading = true;
      this.error = null;
      try {
        this.groups = await GroupDao.fetchAll();
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    /**
     * @docstring
     * (NUEVO) Busca los detalles de un solo grupo por su ID y los guarda en el estado.
     * @param {number} groupId - El ID del grupo a buscar.
     */
    async fetchDetails(groupId: number) {
      this.loading = true;
      this.details = null; // Limpiamos el estado anterior
      this.error = null;
      try {
        // Llama al nuevo método del DAO
        this.details = await GroupDao.fetchDetails(groupId);
      } catch (err: any) {
        this.error = err.message;
        console.error(`Error al buscar el grupo ${groupId}:`, err);
      } finally {
        this.loading = false;
      }
    },
  },
});