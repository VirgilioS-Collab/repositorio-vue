import { defineStore } from 'pinia';
import ActivityDao from '@/services/dao/ActivityDao';
import type { ActivityDTO } from '@/services/dao/models/Activity';

export const useActivityStore = defineStore('activity', {
  state: () => ({
    items: [] as ActivityDTO[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    /**
     * @docstring
     * (CORREGIDO) Busca todas las actividades para un club específico.
     * @param {number} clubId - El ID del club.
     */
    async fetchAll(clubId: number) {
      this.loading = true;
      this.items = [];
      this.error = null;
      try {
        this.items = await ActivityDao.fetchAll(clubId);
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});