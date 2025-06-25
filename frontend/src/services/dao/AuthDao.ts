/**
 * @file src/services/dao/AuthDao.ts
 * @description Capa de Acceso a Datos para la autenticación.
 * - MODIFICADO: Se ha moqueado la función de login para pruebas de UI.
 */
import type { LoginDTO, LoginResponseDTO, userEnrollDTO } from './models/Auth';
import type { UserDTO } from './models/User';
// Se comenta http ya que no se usará en el modo de prueba.
// import http from '@/services/http';

class AuthDao {
    /**
     * @docstring
     * Simula un inicio de sesión.
     */
    async login(credentials: LoginDTO): Promise<LoginResponseDTO> {
        console.log("--- MODO DE PRUEBA DE UI: Intento de login simulado ---", credentials);

        // Simulamos un retraso de red
        await new Promise(resolve => setTimeout(resolve, 500));

        if (credentials.email === 'admin@utp.ac.pa' && credentials.password === 'admin') {
            const mockUser: UserDTO = {
                user_id: 1,
                name: 'Usuario Admin de Prueba',
                email: 'admin@utp.ac.pa',
                role_id: 1, // Rol de Administrador
                status_id: 1
            };

            console.log("--- MODO DE PRUEBA DE UI: Login exitoso simulado ---");
            return {
                login_success: true,
                message: 'Login simulado exitoso.',
                token: 'jwt-token-de-prueba-para-que-funcione-la-app',
                user: mockUser
            };
        } else {
            console.warn("--- MODO DE PRUEBA DE UI: Credenciales incorrectas ---");
            return {
                login_success: false,
                message: 'Credenciales incorrectas. Usa admin@utp.ac.pa y admin'
            };
        }
    }

    // El resto de los métodos no son críticos para visualizar las páginas,
    // así que los dejamos para que no fallen si se llegan a llamar.
    async UserEnroll(payload: userEnrollDTO): Promise<any> {
        console.log("--- MODO DE PRUEBA DE UI: UserEnroll llamado ---", payload);
        return { message: "Registro simulado." };
    }

    async requestPasswordReset(email: string): Promise<any> {
        console.log("--- MODO DE PRUEBA DE UI: requestPasswordReset llamado ---", email);
        return { message: "Solicitud de reseteo simulada." };
    }

    async resetPassword(token: string, newPass: string): Promise<any> {
        console.log("--- MODO DE PRUEBA DE UI: resetPassword llamado ---", token, newPass);
        return { message: "Reseteo de contraseña simulado." };
    }
}

export default new AuthDao();