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
import { useAuthStore } from '@/store/useAuthStore'; // Importar useAuthStore

export const useUserStore = defineStore('user', {
  /**
   * @property state
   * @description El estado inicial del store. Se devuelve como un único objeto
   * para asegurar la correcta inferencia de tipos y reactividad de Pinia.
   */
  state: () => ({
    // El usuario principal ahora se gestiona en useAuthStore. Este store se enfoca en la UI.
    modals: {
        viewProfile: false,
        editProfile: false,
        security: false,
        createActivity: false,
        joinClub: false,
        searchEvents: false,
        profilePictureUpload: false, // Nuevo modal para subir foto de perfil
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
        const authStore = useAuthStore();
        if (!authStore.currentUser || !authStore.currentUser.clubs) return [];
        return state.showAllClubs ? authStore.currentUser.clubs : authStore.currentUser.clubs.slice(0, 3);
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
     * @action updateProfile
     * @description Envía los datos actualizados del perfil del usuario a la API.
     * @param {UserUpdateDTO} payload - Objeto con los campos a actualizar.
     */
    async updateProfile(payload: UserUpdateDTO) {
        const authStore = useAuthStore();
        if (!authStore.currentUser) return;
        this.loading = true;
        this.error = null;
        try {
            const updatedUser = await UserDao.updateProfile(payload);
            // Actualizar el usuario en el store de autenticación
            authStore.user = updatedUser;
            this.showToast('Perfil actualizado exitosamente!', 'success');
        } catch (err: any) {
            this.error = err.message;
            this.showToast('Error al actualizar el perfil.', 'error');
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
      this.showProfileDropdown = false; // Cierra el menú desplegable
    },
    toggleNotificationPanel() {
      this.showNotificationPanel = !this.showNotificationPanel;
    },
    closeNotificationPanel() {
      this.showNotificationPanel = false;
    },
    toggleClubsView() { this.showAllClubs = !this.showAllClubs; },
    toggleProfileDropdown() { this.showProfileDropdown = !this.showProfileDropdown; }, // Acción para el menú
  }
});