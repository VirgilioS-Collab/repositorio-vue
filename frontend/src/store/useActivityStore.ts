/**
 * @file src/store/useActivityStore.ts
 * @description Store de Pinia para gestionar el estado de las actividades.
 * - REFACTORIZADO: Implementa un helper para peticiones DRY y cancelación de peticiones.
 */
import { defineStore } from 'pinia';
import ActivityDao from '@/services/dao/ActivityDao';
import type { ActivityDTO } from '@/services/dao/models/Activity';

export const useActivityStore = defineStore('activity', {
  state: () => ({
    list: [] as ActivityDTO[],
    current: null as ActivityDTO | null,
    loading: false,
    error: null as string | null,
    _controller: null as AbortController | null,
  }),

  actions: {
    async _fetchData(apiCall: (signal: AbortSignal) => Promise<any>, onSuccess: (data: any) => void) {
      if (this._controller) this._controller.abort();
      
      this._controller = new AbortController();
      this.loading = true;
      this.error = null;

      try {
        const data = await apiCall(this._controller.signal);
        onSuccess(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          this.error = err.response?.data?.message || 'Ocurrió un error inesperado al cargar los datos.';
        }
      } finally {
        this.loading = false;
        this._controller = null;
      }
    },

    fetchAll() {
      this._fetchData(
        (signal) => ActivityDao.fetchAll({ signal }),
        (data: ActivityDTO[]) => { this.list = data; }
      );
    },

    fetchById(id: number) {
      this._fetchData(
        (signal) => ActivityDao.fetchById(id, { signal }),
        (data: ActivityDTO) => { this.current = data; }
      );
    },
    
    getNextForMe() {
      this._fetchData(
        (signal) => ActivityDao.getNextForMe({ signal }),
        (data: ActivityDTO[]) => { this.list = data; }
      );
    },
    
    cancelPending() {
      this._controller?.abort();
    }
  },
});