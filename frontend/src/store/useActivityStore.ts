/**
 * @file src/store/useActivityStore.ts
 * @description Store de Pinia para gestionar el estado de las actividades.
 * Contiene la lógica para buscar listas de actividades y detalles individuales.
 */
import { defineStore } from 'pinia';
import ActivityDao from '@/services/dao/ActivityDao';
import type { ActivityDTO } from '@/services/dao/models/Activity';

export const useActivityStore = defineStore('activity', {
  /**
   * @property state
   * @description El estado inicial del store.
   */
  state: () => ({
    /**
     * @property items
     * @description Almacena la lista de actividades (para vistas de lista).
     */
    items: [] as ActivityDTO[],
    /**
     * @property selected
     * @description Almacena los detalles de una única actividad seleccionada.
     */
    selected: null as ActivityDTO | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    /**
     * @action fetchAllActivities
     * @description Busca todas las actividades disponibles a través del DAO.
     * Usado en la página de exploración de actividades.
     */
    async fetchAllActivities() {
        this.loading = true;
        this.error = null;
        try {
            this.items = await ActivityDao.fetchAll();
        } catch (err: any) {
            this.error = err.message;
            console.error("Error en fetchAllActivities:", err);
        } finally {
            this.loading = false;
        }
    },

    /**
     * @action fetchById
     * @description Busca una actividad por ID y la guarda en el estado 'selected'.
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

    /**
     * @action fetchByGroup
     * @description Busca las actividades de un grupo específico.
     * @param {number} groupId - El ID del grupo.
     */
    async fetchByGroup(groupId: number) {
        this.loading = true;
        this.error = null;
        try {
            this.items = await ActivityDao.fetchByGroup(groupId);
        } catch (err: any) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    },
    
    /**
     * @action fetchAllForAdmin
     * @description Busca todas las actividades de un club para el panel de administración.
     * @param {number} clubId - El ID del club.
     */
    async fetchAllForAdmin(clubId: number) {
        this.loading = true;
        this.error = null;
        try {
            this.items = await ActivityDao.fetchAllForAdmin(clubId);
        } catch (err: any) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    },
  },
});