//import type { UserDTO } from '@/services/dao/models/User'

export interface LoginDTO {
    username?: string
    email?: string
    password: string
}

/**
 * Lo que devuelve tu SP user_login:
 * • user_id, username, email, name, last_name, profile_photo_url,
 *   user_type, user_status, login_success, message
 */
export interface LoginResponseDTO {
    user_id: number
    username: string
    email: string
    name: string
    last_name: string
    profile_photo_url: string | null
    user_type: string
    user_status: string
    login_success: boolean
    message: string
    token: string
    user?: {
        user_id: number
        username: string
        email: string
        name: string
        last_name: string
        profile_photo_url: string | null
        user_type: string
        user_status: string
    }
}
