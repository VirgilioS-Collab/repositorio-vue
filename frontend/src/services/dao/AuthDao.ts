import http from '@/services/http'
import type { LoginDTO, LoginResponseDTO } from '@/services/dao/models/Auth'
import type { UserDTO } from '@/services/dao/models/User'

class AuthDao {
    async login(payload: LoginDTO): Promise<LoginResponseDTO> {
        const { data } = await http.post<LoginResponseDTO>('/auth/login', payload)
        return data
    }

    async me(): Promise<UserDTO> {
        const { data } = await http.get<UserDTO>('/auth/me')
        return data
    }

    async logout(): Promise<void> {
        await http.post('/auth/logout')
    }

    async refresh(): Promise<{ token: string }> {
        const { data } = await http.post<{ token: string }>('/auth/refresh')
        return data
    }
}

export default new AuthDao()

