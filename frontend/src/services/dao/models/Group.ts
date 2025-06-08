// src/services/dao/models/Group.ts
export interface GroupDTO {
    group_id: number
    group_name: string
    group_description?: string
    group_status_id: number
    group_owner_id: number
    group_category_id?: number
}

export interface GroupCreateDTO {
    group_name: string
    group_description?: string
    group_status_id: number
    group_category_id?: number
}
