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
        joinClub: false,
        searchEvents: false,
    },
    showNotificationPanel: false,
    toast: { 
      show: false, 
      message: '', 
      type: 'success' as 'success' | 'error' | 'warning' 
    },
    showAllClubs: false,
    showProfileDropdown: false, // Added for navbar dropdown
    loading: false,
    error: null as string | null
  }),

  getters: {
    /**
     * @getter filteredClubs
     * @description Devuelve una lista de los clubs del usuario para el dashboard.
     */
    filteredClubs: (state) => {
        if (!state.user || !state.user.clubs) return [];
        return state.showAllClubs ? state.user.clubs : state.user.clubs.slice(0, 3);
    },
    /**
     * @getter isAnyModalOpen
     * @description Devuelve true si algún modal o panel está activo.
     */
    isAnyModalOpen(state): boolean {
      return Object.values(state.modals).some(isOpen => isOpen);
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
        // Asignar un usuario por defecto en caso de error
        this.user = {
          user_id: 0,
          username: 'Usuario Invitado',
          email: 'invitado@example.com',
          name: 'Usuario Invitado',
          last_name: '',
          profile_photo_url: '',
          clubs: [],
          activities: [],
          notifications: [],
          user_type: 'student', // Añadido
          user_status: 'active', // Añadido
        };
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
    closeAllModals() {
      for (const modal in this.modals) {
        this.modals[modal as keyof typeof this.modals] = false;
      }
    },
    toggleNotificationPanel() {
      this.showNotificationPanel = !this.showNotificationPanel;
    },
    toggleClubsView() { this.showAllClubs = !this.showAllClubs; },
  }
});