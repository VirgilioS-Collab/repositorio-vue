/**
 * @file src/store/useUserStore.ts
 * @description Store de Pinia para gestionar los datos y el estado de la UI
 * del perfil del usuario, incluyendo la gestión de modales y ahora notificaciones.
 * - MODIFICADO: Añadido estado 'showNotificationPanel' y acción 'toggleNotificationPanel'.
 */

// Sección de Librerías/Imports
// =============================================================================
import { defineStore } from 'pinia';
import UserDao from '@/services/dao/UserDao';
import type { UserDTO, UserUpdateDTO } from '@/services/dao/models/User';
import type { GroupDTO } from '@/services/dao/models/Group';
import type { ActivityDTO } from '@/services/dao/models/Activity';


// Sección de Constantes
// =============================================================================
const MOCK_USER: UserDTO = {
    user_id: 1,
    username: 'estudiante.dev',
    email: 'dev@utp.ac.pa',
    name: 'Ana',
    last_name: 'Desarrolladora',
    phone: '6555-4321',
    about_me: 'Soy una estudiante apasionada por la tecnología y el desarrollo de software.',
    profile_photo_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    user_type: 'student',
    user_status: 'active',
    groups: [
        { group_id: 1, group_name: 'Club de Robótica', group_description: 'Construimos robots y competimos a nivel nacional.', group_status_id: 1, group_owner_id: 1 },
        { group_id: 2, group_name: 'Equipo de Debate de la UTP', group_description: 'Practicamos el arte del debate y la argumentación.', group_status_id: 1, group_owner_id: 2 },
        { group_id: 3, group_name: 'Asociación de Software Libre', group_description: 'Promovemos el uso y desarrollo de tecnologías abiertas.', group_status_id: 1, group_owner_id: 3 },
    ],
    activities: [
        { activity_id: 101, activity_name: 'Taller de Soldadura para principiantes', group_name: 'Club de Robótica', start_time: '2025-07-15T14:00:00Z', location: 'Laboratorio FIE' },
        { activity_id: 102, activity_name: 'Debate de práctica semanal', group_name: 'Equipo de Debate de la UTP', start_time: '2025-07-18T18:00:00Z', location: 'Salón 3-401' },
    ]
};

// Sección Principal
// =============================================================================
export const useUserStore = defineStore('user', {
  state: () => {
    const userState: UserDTO | null = MOCK_USER;
    const initialModalsState = {
        viewProfile: false,
        editProfile: false,
        security: false,
        createActivity: false,
        joinGroup: false,
        searchEvents: false,
    };
    const initialToastState = {
        show: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'warning',
    };
    const showAllGroupsState: boolean = false;
    const loadingState: boolean = false;
    const errorState: string | null = null;
    
    // AÑADIDO: Estado para el panel de notificaciones
    const showNotificationPanelState: boolean = false;

    return {
        user: userState,
        modals: initialModalsState,
        toast: initialToastState,
        showAllGroups: showAllGroupsState,
        loading: loadingState,
        error: errorState,
        showNotificationPanel: showNotificationPanelState, // <-- Añadido al estado
    };
  },
  getters: {
    filteredGroups: (state) => {
      if (!state.user || !state.user.groups) return [];
      return state.showAllGroups ? state.user.groups : state.user.groups.slice(0, 3);
    },
    isAnyModalOpen(state): boolean {
      return Object.values(state.modals).some(isOpen => isOpen);
    }
  },
  actions: {
    async fetchProfile(): Promise<void> {
        this.loading = true; this.error = null;
        // try { this.user = await UserDao.fetchProfile(); } catch (err: any) { this.error = err.message; } finally { this.loading = false; }
        console.log("Modo de diseño: Usando datos de maqueta."); await new Promise(resolve => setTimeout(resolve, 500)); this.loading = false;
    },
    async updateProfile(payload: UserUpdateDTO): Promise<void> {
        this.loading = true; this.error = null;
        try {
            await UserDao.updateProfile(payload);
            if (this.user) { Object.assign(this.user, payload); }
            this.toast = { show: true, message: 'Perfil actualizado exitosamente.', type: 'success' };
        } catch (err: any) {
            this.error = err.message; this.toast = { show: true, message: this.error, type: 'error' };
        } finally { this.loading = false; }
    },
    toggleGroupsView(): void { this.showAllGroups = !this.showAllGroups; },
    openModal(modalName: 'viewProfile' | 'editProfile' | 'security' | 'createActivity' | 'joinGroup' | 'searchEvents'): void {
        Object.keys(this.modals).forEach(key => { this.modals[key as keyof typeof this.modals] = false; });
        this.showNotificationPanel = false; // Asegura que el panel de notificaciones se cierre al abrir un modal
        if (Object.prototype.hasOwnProperty.call(this.modals, modalName)) { this.modals[modalName] = true; } else { console.warn(`Intento de abrir un modal con nombre desconocido: ${modalName}`); }
    },
    closeAllModals(): void {
        Object.keys(this.modals).forEach(key => { this.modals[key as keyof typeof this.modals] = false; });
        this.showNotificationPanel = false; // Asegura que el panel de notificaciones también se cierre
    },
    showToast(message: string, type: 'success' | 'error' | 'warning', duration: number = 3000): void {
        this.toast.show = true; this.toast.message = message; this.toast.type = type;
        setTimeout(() => { this.hideToast(); }, duration);
    },
    hideToast(): void { this.toast.show = false; this.toast.message = ''; },

    /**
     * @function toggleNotificationPanel
     * @description (NUEVO) Alterna la visibilidad del panel de notificaciones.
     * Cierra los modales existentes al abrir el panel de notificaciones para
     * evitar superposiciones no deseadas.
     * @returns {void}
     */
    toggleNotificationPanel(): void {
        this.showNotificationPanel = !this.showNotificationPanel;
        // Opcional: Cerrar todos los modales cuando se abre/cierra el panel de notificaciones
        // para asegurar que solo una UI de superposición esté activa a la vez.
        if (this.showNotificationPanel) {
            this.closeAllModals(); // Llama a closeAllModals para cerrar cualquier modal abierto
        }
    }
  }
});