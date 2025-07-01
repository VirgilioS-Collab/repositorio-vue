/**
 * @file src/services/dao/AuthDao.ts
 * @description Data Access Object para todas las operaciones de autenticación.
 * - REFACTORIZADO: Utiliza la instancia 'http' centralizada y se alinea con los DTOs de Auth.ts.
 */
import http from '@/services/http';
import type { LoginDTO, UserEnrollDTO, ForgotPasswordDTO, PasswordResetPayload } from '@/services/dao/models/Auth';
import type { UserDTO } from '@/services/dao/models/User';

class AuthDao {
    /**
     * Envía las credenciales para iniciar sesión. El backend establecerá las cookies HttpOnly.
     */
    async login(payload: LoginDTO): Promise<void> {
        await http.post('/auth/login', payload);
    }

    /**
     * Envía los datos de un nuevo usuario para su registro.
     */
    async register(payload: UserEnrollDTO): Promise<void> {
        await http.post('/auth/register', payload);
    }

    /**
     * Solicita al backend un correo de recuperación de contraseña.
     */
    async forgotPassword(payload: ForgotPasswordDTO): Promise<void> {
        await http.post('/auth/forgot-password', payload);
    }

    /**
     * Envía la nueva contraseña junto con el token/código de verificación.
     */
    async resetPassword(payload: PasswordResetPayload): Promise<void> {
        await http.post('/auth/submitPasswordReset', payload);
    }

    /**
     * Obtiene el perfil del usuario actualmente autenticado a través de su sesión (cookie).
     */
    async me(): Promise<UserDTO> {
        const { data } = await http.get<UserDTO>('/auth/me');
        return data;
    }
	
    /**
     * Notifica al backend para que invalide la sesión y borre las cookies del navegador.
     */
    async logout(): Promise<void> {
        await http.post('/auth/logout');
    }
}

// Se exporta una única instancia para seguir el patrón Singleton[cite: 122].
export default new AuthDao();