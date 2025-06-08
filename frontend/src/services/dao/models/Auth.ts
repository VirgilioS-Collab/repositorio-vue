//import type { UserDTO } from '@/services/dao/models/User'

export interface LoginDTO {
    username?: string
    email?: string
    password: string
}

export interface userEnrollDTO {
    firstName: string
    lastName: string
    username: string
    email: string
    phone: string
    docType: string
    docNumber: string
    birthDate: string
    gender: string
    password: string
}

export interface userEnrollResponseDTO{
    email: string
    message: string
    success: boolean
    user_id: number
    username: string
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
    //No se maneja JWT
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
