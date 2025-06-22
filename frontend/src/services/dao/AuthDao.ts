/**
 * @file src/services/dao/AuthDao.ts
 * @description Capa de acceso a datos (DAO) para la autenticación.
 * Centraliza todas las llamadas a la API relacionadas con la gestión
 * de usuarios y sesiones.
 */
import http from '@/services/http'
import type { LoginDTO, LoginResponseDTO, userEnrollDTO, userEnrollResponseDTO } from '@/services/dao/models/Auth'
//import type { UserDTO } from '@/services/dao/models/User'

class AuthDao {
    /**
     * @docstring
     * Envía las credenciales del usuario al endpoint de login.
     */
    async login(payload: LoginDTO): Promise<LoginResponseDTO> {
        const response = await http.post<LoginResponseDTO>('/auth/login', payload)
        return response.data
    }

    /**
     * @docstring
     * Envía los datos de un nuevo usuario al endpoint de registro.
     */
    async UserEnroll(payload: userEnrollDTO): Promise<userEnrollResponseDTO> {
        const response = await http.post<userEnrollResponseDTO>('/auth/enroll', payload)
        return response.data
    }

    /**
     * @docstring
     * (NUEVO) Envía una solicitud para iniciar el proceso de recuperación de contraseña.
     */
    async requestPasswordReset(email: string): Promise<void> {
        await http.post('/auth/forgot-password', { email })
    }

    /**
     * @docstring
     * (NUEVO) Envía el token y la nueva contraseña para completar el restablecimiento.
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        await http.post('/auth/reset-password', { token, new_password: newPassword })
    }
    
    // Otros métodos como me(), logout(), etc.
}

export default new AuthDao()
