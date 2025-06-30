/**
 * @file src/store/useAuthStore.ts
 * @description Store de Pinia para gestionar el estado de autenticación y el perfil de usuario.
 * No almacena tokens; depende de las cookies HttpOnly gestionadas por el navegador.
 */
import { defineStore } from 'pinia';
import AuthDao from '@/services/dao/AuthDao';
import type { LoginDTO, PasswordResetPayload } from '@/services/dao/models/Auth';
import type { UserDTO, UserLeanDTO } from '@/services/dao/models/User';

// Canal para sincronizar el estado de logout entre pestañas abiertas.
const authChannel = new BroadcastChannel('auth');

/**
 * Mapea el DTO completo del usuario a la versión "lean" que se usa en el estado.
 * @param {UserDTO} fullUser - El objeto de usuario completo recibido de la API.
 * @returns {UserLeanDTO} El objeto de usuario ligero para la UI.
 */
function mapUserToLean(fullUser: UserDTO): UserLeanDTO {
    const { user_id, name, user_type, profile_photo_url } = fullUser;
    return { user_id, name, user_type, avatar: profile_photo_url };
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as UserLeanDTO | null,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        /**
         * Determina si el usuario está autenticado basándose en la existencia del objeto 'user'.
         */
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        /**
         * Carga el perfil "lean" del usuario si existe una sesión de cookie válida.
         * Es el punto de entrada para inicializar la sesión en la aplicación.
         */
        async bootstrap() {
            if (this.user) return; // Evita recargar si el usuario ya está en el estado.
            
            this.loading = true;
            try {
                const fullUser = await AuthDao.me();
                this.user = mapUserToLean(fullUser);
            } catch (err: any) {
                this.user = null; // Limpia el usuario si el bootstrap falla
            } finally {
                this.loading = false;
            }
        },

        /**
         * Maneja el proceso de inicio de sesión.
         */
        async login(payload: LoginDTO) {
            this.loading = true;
            this.error = null;
            try {
                await AuthDao.login(payload);
                await this.bootstrap(); // Cargar el perfil inmediatamente después del login.
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Credenciales inválidas.';
                throw this.error; // Lanza el error para que la vista pueda manejarlo.
            } finally {
                this.loading = false;
            }
        },
        
        /**
         * Cierra la sesión del usuario, notificando al backend y a otras pestañas.
         */
        logout() {
            // Notifica al backend para invalidar el refresh_token.
            // Se usa .catch para que el logout del frontend no se bloquee si la llamada falla.
            AuthDao.logout().catch(() => {});
            
            this.$reset(); // Resetea el estado del store a su valor inicial.
            authChannel.postMessage('logout'); // Notifica a otras pestañas.
        },
    },
});

// Listener que escucha eventos de otras pestañas para mantener la sesión sincronizada.
authChannel.onmessage = (event) => {
    if (event.data === 'logout' && useAuthStore().isAuthenticated) {
        useAuthStore().logout();
        // Opcional: forzar una recarga para asegurar que el usuario vea la página de login.
        window.location.reload();
    }
};