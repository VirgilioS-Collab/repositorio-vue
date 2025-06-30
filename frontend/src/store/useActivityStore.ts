/**
 * @file src/store/useActivityStore.ts
 * @description Store de Pinia para gestionar el estado de las actividades.
 * Implementa un helper para peticiones DRY y cancelación de peticiones.
 */
import { defineStore } from 'pinia';
import ActivityDao from '@/services/dao/ActivityDao';
import type { ActivityDTO } from '@/services/dao/models/Activity';

export const useActivityStore = defineStore('activity', {
  state: () => ({
    list: [] as ActivityDTO[],
    currentActivity: null as ActivityDTO | null,
    loading: false,
    error: null as string | null,
    _controller: null as AbortController | null,
  }),

  actions: {
    /**
     * Helper privado para encapsular la lógica de fetch, manejo de estado y errores.
     * @param apiCall - La función del DAO que se debe ejecutar.
     * @param onSuccess - Callback para procesar los datos en caso de éxito.
     */
    async _fetchData(apiCall: (signal: AbortSignal) => Promise<any>, onSuccess: (data: any) => void) {
      if (this._controller) this._controller.abort();
      
      this._controller = new AbortController();
      this.loading = true;
      this.error = null;

      try {
        const data = await apiCall(this._controller.signal);
        onSuccess(data);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        this.error = err.response?.data?.message || 'Ocurrió un error inesperado al cargar los datos.';
      } finally {
        this.loading = false;
        this._controller = null;
      }
    },

    /**
     * Carga todas las actividades públicas.
     */
    fetchAll() {
      this._fetchData(
        (signal) => ActivityDao.fetchAll({ signal }),
        (data: ActivityDTO[]) => { this.list = data; }
      );
    },

    /**
     * Carga los detalles de una actividad por su ID.
     * @param {number} id - El ID de la actividad a cargar.
     */
    fetchById(id: number) {
      // No se limpia 'currentActivity' para evitar parpadeos en la UI.
      this._fetchData(
        (signal) => ActivityDao.fetchById(id, { signal }),
        (data: ActivityDTO) => { this.currentActivity = data; }
      );
    },
    
    /**
     * Método público para cancelar la petición en curso desde un componente.
     */
    cancelPending() {
      this._controller?.abort();
    }
  },
});