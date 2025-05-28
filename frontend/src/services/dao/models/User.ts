export interface UserDTO {
    user_id: number
    username: string
    email: string
    name: string
    last_name: string
    phone?: string
    about_me?: string
    profile_photo_url?: string | null
    user_type: string
    user_status: string
}

export interface UserUpdateDTO {
    name?: string
    last_name?: string
    email?: string
    phone?: string
    about_me?: string
    profile_photo_url?: string
}

