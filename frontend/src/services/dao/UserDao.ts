import http from '@/services/http'
import type { UserDTO, UserUpdateDTO } from '@/services/dao/models/User'

class UserDao {
    async fetchProfile(): Promise<UserDTO> {
        const { data } = await http.get<UserDTO>('/users/me')
        return data
    }

    async updateProfile(payload: UserUpdateDTO): Promise<void> {
        await http.put('/users/me', payload)
    }

    async changePassword(current_password: string, new_password: string): Promise<void> {
        await http.post('/users/me/change-password', { current_password, new_password })
    }
}

export default new UserDao()
