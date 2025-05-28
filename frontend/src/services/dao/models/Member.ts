export interface MemberDTO {
    user_id: number
    group_id: number
    signup_date: string
    role_id: number
    status_id: number
    approved_by?: number
    updated_at: string
}

export interface MemberStatsDTO {
    active: number
    newMembers: number
    droppedMembers: number
}
