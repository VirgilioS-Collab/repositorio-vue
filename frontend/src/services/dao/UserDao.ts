/**
 * @file src/services/dao/UserDao.ts
 * @description Capa de Acceso a Datos para el modelo de Usuario.
 * - MODIFICADO: Se corrige el método `updateProfile` para que acepte un
 * `userId` y el `payload`, y para que devuelva el objeto UserDTO actualizado
 * desde la API, sincronizándolo con la lógica del store.
 */
import http from '@/services/http';
import type { UserDTO, UserUpdateDTO } from '@/services/dao/models/User';

class UserDao {
    /**
     * @docstring
     * Obtiene el perfil completo del usuario autenticado.
     */
    async fetchProfile(): Promise<UserDTO> {
        const { data } = await http.get<UserDTO>('/api/auth/me');
        return data;
    }

    /**
     * @docstring
     * Actualiza el perfil de un usuario específico.
     * @param {number} userId - El ID del usuario a actualizar.
     * @param {UserUpdateDTO} payload - Los datos a actualizar.
     * @returns {Promise<UserDTO>} El objeto de usuario con los datos actualizados.
     */
    async updateProfile(userId: number, payload: UserUpdateDTO): Promise<UserDTO> {
        // Asume que tu API para actualizar un usuario es PUT /users/:id
        const { data } = await http.put<UserDTO>(`/users/${userId}`, payload);
        return data;
    }

    /**
     * @docstring
     * Cambia la contraseña del usuario.
     */
    async changePassword(userId: number, current_password: string, new_password: string): Promise<void> {
        await http.post(`/users/${userId}/change-password`, { current_password, new_password });
    }
}

export default new UserDao();