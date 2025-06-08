export interface ClubDTO {
    group_id: number
    group_name: string
    group_description?: string
    group_status_id: number
    group_owner_id: number
    group_category_id?: number
}

export interface ClubUpdateDTO {
    group_name?: string
    group_description?: string
    group_status_id?: number
    group_category_id?: number
}
