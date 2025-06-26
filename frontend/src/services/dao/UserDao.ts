import http from '@/services/http';
import type { UserDTO, UserUpdateDTO } from '@/services/dao/models/User';

class UserDao {
    async fetchProfile(): Promise<UserDTO> {
        const { data } = await http.get<UserDTO>('/auth/me');
        return data;
    }

    async updateProfile(userId: number, payload: UserUpdateDTO): Promise<UserDTO> {
        const { data } = await http.put<UserDTO>(`/users/${userId}`, payload);
        return data;
    }

    async changePassword(userId: number, current_password: string, new_password: string): Promise<void> {
        await http.post(`/users/${userId}/change-password`, { current_password, new_password });
    }
}

export default new UserDao();