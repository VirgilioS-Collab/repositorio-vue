// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import AuthDao from '@/services/dao/AuthDao'; // Importa el DAO de autenticación
import type { LoginDTO } from '@/services/dao/models/Auth'; // Importa el DTO de login
import type { UserDTO, UserLeanDTO } from '@/services/dao/models/User'; // Importa UserDTO y AHORA UserLeanDTO

// --- SECCIÓN DE INTERFACES ---
/**
 * @interface JwtPayload
 * @description Define la estructura esperada del payload decodificado de un token JWT.
 * Esto proporciona seguridad de tipos al acceder a las propiedades del token.
 */
interface JwtPayload {
  user_id: number;
  u_username: string;
  u_email: string;
  u_name: string;
  u_last_name: string;
  u_user_type: 'student' | 'admin' | 'leader';
  exp: number;
}

// --- SECCIÓN DE HELPERS ---
/**
 * @docstring
 * Función auxiliar para mapear un objeto `UserDTO` completo (recibido del backend)
 * a una versión "más ligera" (`UserLeanDTO`) específica para el estado del store.
 * Esto optimiza la memoria al mantener solo los datos esenciales para la UI en el estado global.
 * @param {UserDTO} userDto - El objeto UserDTO completo recibido del DAO.
 * @returns {UserLeanDTO} Un objeto UserLeanDTO con las propiedades relevantes para el store.
 * @effects Realiza una transformación de datos.
 */
function mapUserToLean(userDto: UserDTO): UserLeanDTO {
  return {
    user_id: userDto.user_id,
    u_username: userDto.u_username,
    u_email: userDto.u_email,
    u_name: userDto.u_name,
    u_last_name: userDto.u_last_name,
    u_user_type: userDto.u_user_type,
    // La propiedad `avatar` en UserLeanDTO es opcional y puede ser `null`.
    // Si `u_profile_photo_url` es `null`, `avatar` también lo será, lo cual es correcto.
    avatar: userDto.u_profile_photo_url || null, 
  };
}

// --- SECCIÓN PRINCIPAL DEL STORE ---
export const useAuthStore = defineStore('auth', {
  /**
   * @docstring
   * Define el estado inicial del store de autenticación.
   * @property {UserLeanDTO | null} user - Objeto que contiene la información esencial
   * del usuario autenticado, o `null` si no hay usuario.
   * @property {string | null} accessToken - El token JWT utilizado para autenticar las solicitudes a la API, o `null`.
   * @property {boolean} loading - Indicador booleano para mostrar el estado de carga de las operaciones de autenticación.
   * @property {string | null} error - Mensaje de error para las operaciones de autenticación, o `null` si no hay error.
   */
  state: () => ({
    user: null as UserLeanDTO | null, // CAMBIO: Tipo de user ahora es UserLeanDTO | null
    accessToken: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  /**
   * @docstring
   * Define los getters (propiedades computadas) del store, que derivan información del estado.
   * Proporcionan una interfaz para acceder a los datos del store de manera reactiva.
   */
  getters: {
    /**
     * @docstring
     * Indica si el usuario está autenticado (si hay un token de acceso presente).
     * @returns {boolean} `true` si `accessToken` no es `null` ni una cadena vacía, `false` en caso contrario.
     */
    isAuthenticated: (state) => !!state.accessToken,
    
    /**
     * @docstring
     * Devuelve la información esencial del usuario actualmente autenticado.
     * @returns {UserLeanDTO | null} El objeto `UserLeanDTO` del usuario o `null`.
     */
    currentUser: (state) => state.user,
    
    /**
     * @docstring
     * Indica si alguna operación de autenticación está en curso.
     * @returns {boolean} `true` si `loading` es `true`, `false` en caso contrario.
     */
    isLoadingAuth: (state) => state.loading,
    
    /**
     * @docstring
     * Devuelve el mensaje de error actual, si existe.
     * @returns {string | null} El mensaje de error o `null`.
     */
    authError: (state) => state.error,
  },

  /**
   * @docstring
   * Define las acciones (métodos que modifican el estado o realizan operaciones asíncronas) del store.
   */
  actions: {
    /**
     * @docstring
     * Establece el token de acceso en el estado del store y lo persiste en `sessionStorage`.
     * Esto asegura que el token se mantenga a través de las recargas de página.
     * @param {string | null} token - El token JWT a establecer. Si es `null`, se eliminará el token.
     * @effects Actualiza la propiedad `accessToken` del store y modifica el `sessionStorage`.
     */
    setAccessToken(token: string | null): void {
      this.accessToken = token;
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    },

    /**
     * @docstring
     * Intenta cargar y validar el token desde localStorage para restaurar la sesión.
     * Se ejecuta al iniciar la aplicación.
     */
    async tryLoadTokenFromStorage(): Promise<void> {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return;
      }

      try {
        const decodedToken: JwtPayload = jwtDecode(token);

        // Verifica si el token ha expirado
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log('Token expirado. Se requiere nuevo inicio de sesión.');
          this.logout();
          return;
        }

        this.setAccessToken(token);
        
        // Creamos un objeto de usuario parcial a partir del token.
        // Los detalles completos (como clubs o actividades) se deberían cargar
        // desde un endpoint de API (/api/auth/me) si es necesario.
        this.user = {
          user_id: decodedToken.user_id,
          u_username: decodedToken.u_username,
          u_email: decodedToken.u_email,
          u_name: decodedToken.u_name,
          u_last_name: '', // Assuming last_name is not in JWT payload, set to empty string
          u_user_type: decodedToken.u_user_type,
          avatar: null, // El avatar no viene en el payload del token
        };
      } catch (error) {
        console.error('Token inválido o malformado:', error);
        this.logout();
      }
    },

    /**
     * @docstring
     * Maneja el proceso de inicio de sesión del usuario.
     * Envía las credenciales al `AuthDao.login()` para obtener un token,
     * luego usa ese token para obtener los detalles del usuario actual (`AuthDao.me()`)
     * y los mapea a `UserLeanDTO` para el estado del store.
     * @param {LoginDTO} payload - Las credenciales de inicio de sesión (email, password).
     * @returns {Promise<void>} Una promesa que se resuelve si el login es exitoso
     * (token y user establecidos).
     * @throws {Error} Si las credenciales son inválidas o ocurre otro error de autenticación.
     * El error se captura y su mensaje se almacena en `this.error`.
     * @effects Establece `loading` a `true` durante la operación. Si es exitoso,
     * establece `accessToken` y `user`. Si falla, establece `error`.
     */
    async login(payload: LoginDTO): Promise<void> {
      this.loading = true;
      this.error = null; // Limpiar errores anteriores
      try {
        const { token } = await AuthDao.login(payload);
        this.setAccessToken(token);
        // Una vez logueado y con el token, obtener los detalles del usuario
        // y mapearlos a la versión "lean".
        const fullUser = await AuthDao.me();
        this.user = mapUserToLean(fullUser); // CAMBIO: Mapeo a UserLeanDTO
      } catch (e: any) {
        // Capturar el error y establecer un mensaje amigable, si es posible del backend.
        this.error = e.response?.data?.message || 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
        // Es importante re-lanzar el error para que los componentes de la UI que llamen a esta
        // acción puedan manejar la notificación de error (ej. mostrar un toast).
        throw e;
      } finally {
        this.loading = false;
      }
    },

    /**
     * @docstring
     * Cierra la sesión del usuario.
     * Envía una solicitud de logout al backend (`AuthDao.logout()`) para invalidar el token
     * en el servidor, y luego limpia el estado local del store y el `sessionStorage`.
     * @returns {Promise<void>} Una promesa que se resuelve cuando la sesión ha sido cerrada
     * tanto en el frontend como, si es posible, en el backend.
     * @effects Limpia el `accessToken` y `user` del store y de `sessionStorage`.
     * Restablece el estado de `loading` y `error`.
     */
    async logout(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await AuthDao.logout(); // Llamar al backend para invalidar el token si aplica.
      } catch (e) {
        console.error("Error al cerrar sesión en el backend:", e);
        // No es crítico si el logout del backend falla (el token puede haber expirado, etc.),
        // el objetivo principal es limpiar la sesión local.
      } finally {
        this.setAccessToken(null); // Limpiar el token localmente.
        this.user = null; // Limpiar la información del usuario.
        this.loading = false;
      }
    },
    /**
     * @docstring
     * Actualiza la URL de la foto de perfil del usuario en el estado.
     * @param {string} newImageUrl - La nueva URL de la imagen de perfil.
     */
    updateUserProfilePicture(newImageUrl: string) {
      if (this.user) {
        this.user.avatar = newImageUrl;
      }
    },
  },
});