import type { LoginDTO, LoginResponseDTO, userEnrollDTO, userEnrollResponseDTO } from './models/Auth';
import http from '@/services/http';

class AuthDao {
    async login(payload: LoginDTO): Promise<LoginResponseDTO> {
        const { data } = await http.post<LoginResponseDTO>('/auth/login', payload);
        return data;
    }

    async UserEnroll(payload: userEnrollDTO): Promise<userEnrollResponseDTO> {
        const { data } = await http.post<userEnrollResponseDTO>('/auth/register', payload);
        return data;
    }

    async requestPasswordReset(email: string): Promise<void> {
        await http.post('/auth/forgot-password', { email });
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        await http.post('/auth/reset-password', { token, new_password: newPassword });
    }
}

export default new AuthDao();