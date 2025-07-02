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
    items: ACTIVITY_CATEGORIES as readonly string[],
    loading: false,
    _fetched: false, // Bandera para evitar llamadas múltiples
  }),

  actions: {
    /**
     * Carga las categorías desde la API de forma silenciosa.
     * Si falla, la aplicación continúa funcionando con las categorías de fallback.
     */
    async fetchAll() {
      if (this._fetched || this.loading) return;

      this.loading = true;
      try {
        const { data } = await http.get<string[]>('/activity-categories');
        if (Array.isArray(data) && data.length > 0) {
          this.items = data;
        }
        this._fetched = true;
      } catch (e: any) {
        console.error('Failed to fetch activity categories, using fallback. Error:', e.message);
      } finally {
        this.loading = false;
      }
    }
  }
});