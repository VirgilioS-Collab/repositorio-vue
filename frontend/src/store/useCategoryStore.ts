/**
 * @file src/store/useCategoryStore.ts
 * @description Store de Pinia para gestionar las categorías de actividades.
 * Usa constantes locales como fallback y las actualiza desde la API.
 */
import { defineStore } from 'pinia';
import { ACTIVITY_CATEGORIES } from '@/constants';
import http from '@/services/http';

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    /**
     * La lista de categorías. Se inicializa con las constantes locales.
     */
    items: ACTIVITY_CATEGORIES as readonly string[],
    loading: false,
    error: null as string | null,
    /**
     * Bandera para asegurar que el fetch solo se ejecute una vez por sesión.
     */
    _fetched: false,
  }),

  actions: {
    /**
     * Carga las categorías desde la API de forma silenciosa.
     * Si falla, la aplicación continúa funcionando con las categorías de fallback.
     */
    async fetchAll() {
      if (this._fetched) return; // Evita llamadas múltiples

      this.loading = true;
      try {
        // Usa `http` directamente para no modificar los DAOs existentes.
        const { data } = await http.get<string[]>('/activity-categories');
        
        if (Array.isArray(data) && data.length > 0) {
          this.items = data;
        }
        this._fetched = true;
      } catch (e: any) {
        // El fallo es silencioso para no interrumpir la UI, ya que tenemos el fallback.
        console.error('Failed to fetch activity categories:', e.message);
      } finally {
        this.loading = false;
      }
    }
  }
});