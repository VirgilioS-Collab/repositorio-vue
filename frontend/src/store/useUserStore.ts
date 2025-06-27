/**
 * @file src/store/useUserStore.ts
 * @description Store de Pinia para gestionar los datos y el estado de la UI del usuario.
 * - CORREGIDO: Se simplifica la función `state` para devolver un objeto
 * directamente, resolviendo los errores de TypeScript sobre propiedades
 * inexistentes (`loading`, `error`, etc.).
 */
import { defineStore } from 'pinia';
import UserDao from '@/services/dao/UserDao';
import type { UserDTO, UserUpdateDTO } from '@/services/dao/models/User';

export const useUserStore = defineStore('user', {
  /**
   * @property state
   * @description El estado inicial del store. Se devuelve como un único objeto
   * para asegurar la correcta inferencia de tipos y reactividad de Pinia.
   */
  state: () => ({
    user: null as UserDTO | null,
    modals: {
        viewProfile: false,
        editProfile: false,
        security: false,
        createActivity: false,
        joinGroup: false,
        searchEvents: false,
    },
    showNotificationPanel: false,
    toast: { 
      show: false, 
      message: '', 
      type: 'success' as 'success' | 'error' | 'warning' 
    },
    showAllGroups: false,
    loading: false,
    error: null as string | null
  }),

  getters: {
    /**
     * @getter filteredGroups
     * @description Devuelve una lista de los grupos del usuario para el dashboard.
     */
    filteredGroups: (state) => {
        if (!state.user || !state.user.groups) return [];
        return state.showAllGroups ? state.user.groups : state.user.groups.slice(0, 3);
    },
    /**
     * @getter isAnyModalOpen
     * @description Devuelve true si algún modal o panel está activo.
     */
    isAnyModalOpen(state): boolean {
      return Object.values(state.modals).some(isOpen => isOpen) || state.showNotificationPanel;
    }
  },
    
  actions: {
    /**
     * @action fetchProfile
     * @description Busca los datos del perfil del usuario desde la API.
     */
    async fetchProfile() {
        this.loading = true;
        this.error = null;
        try {
            this.user = await UserDao.fetchProfile();
        } catch (err: any) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    },

    /**
     * @action updateProfile
     * @description Envía los datos actualizados del perfil del usuario a la API.
     * @param {UserUpdateDTO} payload - Objeto con los campos a actualizar.
     */
    async updateProfile(payload: UserUpdateDTO) {
        if (!this.user) return;
        this.loading = true;
        this.error = null;
        try {
            const updatedUser = await UserDao.updateProfile(this.user.user_id, payload);
            this.user = updatedUser;
        } catch (err: any) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    },

    showToast(message: string, type: 'success' | 'error' | 'warning', duration: number = 3000){
        this.toast = { show: true, message, type };
        setTimeout(() => { this.toast.show = false; }, duration);
    },

    openModal(modalName: keyof typeof this.modals) {
      this.modals[modalName] = true;
    },
    closeAllModals() { /* ... */ },
    toggleNotificationPanel() { /* ... */ },
    toggleGroupsView() { this.showAllGroups = !this.showAllGroups; },
  }
});