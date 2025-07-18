/**
 * @file src/services/dao/AuthDao.ts
 * @description DAO (Data Access Object) para operaciones de autenticación.
 * Este archivo encapsula la lógica de comunicación con el API de autenticación,
 * aislando los componentes de la aplicación de los detalles de las llamadas HTTP.
 * Proporciona métodos para login, refresh de token, registro, restablecimiento de contraseña,
 * obtención del usuario actual y logout.
 * - REVISADO: No se necesitan cambios lógicos en los métodos que devuelven data,
 * ya que simplemente pasan el objeto `data` recibido del backend. El tipado de estos
 * métodos ahora es correcto gracias a la actualización de los DTOs en `models/Auth.ts`.
 */

import http from '@/services/http'; // Importa la instancia de Axios configurada
import type { 
  LoginDTO, 
  UserEnrollDTO, 
  ForgotPasswordDTO, 
  PasswordResetPayload, 
  LoginResponseDTO, 
  RefreshResponseDTO, 
  VerifyCodeDTO, 
  ChangePasswordDTO, 
  SuccessResponseDTO,
  ForgotPasswordResponseDTO
} from '@/services/dao/models/Auth'; // Importa los DTOs de autenticación
import type { UserDTO } from '@/services/dao/models/User'; // Importa el DTO del usuario para el método 'me'

/**
 * @docstring
 * Clase AuthDao que proporciona métodos para interactuar con la API de autenticación.
 * Sigue el patrón DAO para separar la lógica de acceso a datos.
 */
class AuthDao {
    /**
     * @docstring
     * Realiza una solicitud de inicio de sesión al backend.
     * @param {LoginDTO} payload - Los datos de credenciales del usuario (email y password).
     * @returns {Promise<LoginResponseDTO>} Una promesa que resuelve con un objeto `LoginResponseDTO`
     * que contiene el token de autenticación.
     * @throws {AxiosError} Si la solicitud falla (e.g., credenciales inválidas).
     * @effects Envía una petición POST al endpoint '/api/auth/login'.
     */
    static async login(payload: LoginDTO): Promise<LoginResponseDTO> {
        const { data } = await http.post<LoginResponseDTO>('/api/auth/login', payload);
        return data; // Devuelve correctamente el objeto con la propiedad `token`
    }
  
    /**
     * @docstring
     * Solicita un nuevo token de acceso al backend, típicamente usando un token de refresco
     * manejado por las cookies o el propio backend.
     * @returns {Promise<RefreshResponseDTO>} Una promesa que resuelve con un objeto `RefreshResponseDTO`
     * que contiene el nuevo token de autenticación.
     * @throws {AxiosError} Si la solicitud falla (e.g., token de refresco inválido/expirado).
     * @effects Envía una petición POST al endpoint '/api/auth/refresh'.
     */
    static async refresh(): Promise<RefreshResponseDTO> {
        const { data } = await http.post<RefreshResponseDTO>('/api/auth/refresh');
        return data; // Devuelve correctamente el objeto con la propiedad `token`
    }
  
    /**
     * @docstring
     * Registra un nuevo usuario en el sistema.
     * @param {UserEnrollDTO} payload - Los datos del nuevo usuario para el registro.
     * @returns {Promise<void>} Una promesa que se resuelve cuando el registro es exitoso.
     * No se espera una respuesta con datos específicos del backend.
     * @throws {AxiosError} Si la solicitud falla (e.g., usuario existente, datos inválidos).
     * @effects Envía una petición POST al endpoint '/api/auth/enroll'.
     */
    static async register(p: UserEnrollDTO): Promise<void> {
      await http.post('/api/auth/enroll', p);
    }

    /**
     * @docstring
     * Solicita al backend que envíe un enlace o código de restablecimiento de contraseña
     * al correo electrónico proporcionado.
     * @param {ForgotPasswordDTO} payload - El objeto que contiene el correo electrónico del usuario.
     * @returns {Promise<ForgotPasswordResponseDTO>} Una promesa que se resuelve con el token temporal.
     * @throws {AxiosError} Si la solicitud falla.
     * @effects Envía una petición POST al endpoint '/api/auth/forgot-password'.
     */
    static async forgotPassword(p: ForgotPasswordDTO): Promise<ForgotPasswordResponseDTO> {
      const { data } = await http.post<ForgotPasswordResponseDTO>('/api/auth/forgot-password', p);
      return data;
    }

    /**
     * @docstring
     * Envía la nueva contraseña junto con el email y el código de verificación
     * para restablecer la contraseña de una cuenta.
     * @param {PasswordResetPayload} payload - El objeto que contiene el email,
     * el código de verificación y la nueva contraseña.
     * @returns {Promise<void>} Una promesa que se resuelve cuando la contraseña ha sido restablecida.
     * @throws {AxiosError} Si la solicitud falla (e.g., código inválido/expirado).
     * @effects Envía una petición POST al endpoint '/api/auth/submitPasswordReset'.
     */
    static async resetPassword(p: PasswordResetPayload): Promise<void> {
      await http.post('/api/auth/submitPasswordReset', p);
    }

    /**
     * @docstring
     * Obtiene la información detallada del usuario actualmente autenticado.
     * @returns {Promise<UserDTO>} Una promesa que resuelve con un objeto `UserDTO`
     * del usuario autenticado.
     * @throws {AxiosError} Si la solicitud falla (e.g., token inválido/expirado).
     * @effects Envía una petición GET al endpoint '/api/auth/me'.
     */
    static async me(): Promise<UserDTO> { 
      const { data } = await http.get<UserDTO>('/api/auth/me'); 
      return data; 
    }

    /**
     * @docstring
     * Cierra la sesión del usuario actual en el backend.
     * @returns {Promise<void>} Una promesa que se resuelve cuando la sesión ha sido cerrada.
     * @throws {AxiosError} Si la solicitud falla.
     * @effects Envía una petición POST al endpoint '/api/auth/logout'.
     */
    static async logout(): Promise<void> { 
      await http.post('/api/auth/logout'); 
    }

    /**
     * @docstring
     * Verifica el código de restablecimiento de contraseña.
     * @param {VerifyCodeDTO} payload - El código de verificación.
     * @returns {Promise<SuccessResponseDTO>} Una promesa que se resuelve cuando el código es válido.
     * @throws {AxiosError} Si la solicitud falla (e.g., código inválido/expirado).
     * @effects Envía una petición POST al endpoint '/api/auth/verifyPassResetCode'.
     */
    static async verifyResetCode(p: VerifyCodeDTO): Promise<SuccessResponseDTO> {
        const { data } = await http.post<SuccessResponseDTO>('/api/auth/verifyPassResetCode', p);
        return data;
    }

    /**
     * @docstring
     * Cambia la contraseña del usuario autenticado.
     * @param {ChangePasswordDTO} payload - Las contraseñas actual y nueva.
     * @returns {Promise<SuccessResponseDTO>} Una promesa que se resuelve cuando la contraseña ha sido cambiada.
     * @throws {AxiosError} Si la solicitud falla (e.g., contraseña actual incorrecta).
     * @effects Envía una petición POST al endpoint '/api/users/me/change-password'.
     */
    static async changePassword(p: ChangePasswordDTO): Promise<SuccessResponseDTO> {
        const { data } = await http.post<SuccessResponseDTO>('/api/users/me/change-password', p);
        return data;
    }

    /**
     * @docstring
     * Actualiza la información del perfil del usuario autenticado.
     * @param {Partial<UserDTO>} payload - Los datos a actualizar del usuario.
     * @returns {Promise<UserDTO>} Una promesa que resuelve con los datos actualizados del usuario.
     * @throws {AxiosError} Si la solicitud falla.
     * @effects Envía una petición PUT al endpoint '/api/auth/me'.
     */
    static async updateProfile(p: Partial<UserDTO>): Promise<UserDTO> {
        const { data } = await http.put<UserDTO>('/api/auth/me', p);
        return data;
    }
}

export default AuthDao;