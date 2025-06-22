/**
 * @file src/store/useActivityStore.ts
 * @description Store de Pinia para gestionar el estado de las actividades.
 * - AÑADIDO: Estado 'selected' para la actividad en detalle y acción 'fetchById'.
 */
import { defineStore } from 'pinia';
import ActivityDao from '@/services/dao/ActivityDao';
import type { ActivityDTO } from '@/services/dao/models/Activity';

export const useActivityStore = defineStore('activity', {
  state: () => ({
    items: [] as ActivityDTO[],
    // AÑADIDO: Para guardar la actividad seleccionada
    selected: null as ActivityDTO | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    // Aquí podría ir una acción fetchAllActivities() en el futuro
    
    /**
     * @docstring
     * (NUEVO) Busca una actividad por ID y la guarda en el estado 'selected'.
     * @param {number} activityId - El ID de la actividad a buscar.
     */
    async fetchById(activityId: number) {
      this.loading = true;
      this.selected = null;
      this.error = null;
      try {
        this.selected = await ActivityDao.fetchById(activityId);
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});