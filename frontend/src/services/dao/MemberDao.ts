/**
 * @file src/services/dao/MemberDao.ts
 * @description Capa de Acceso a Datos para los Miembros del Club.
 * - MODIFICADO: Moqueado para pruebas de UI.
 * - CORREGIDO: Añadido 'updated_at' a los datos de prueba para cumplir con la interfaz MemberDTO.
 * - CORREGIDO: Se usa un guion bajo (_) en parámetros no utilizados para eliminar advertencias.
 */
// import http from "@/services/http"
import type { MemberDTO, MemberStatsDTO } from "@/services/dao/models/Member.ts"

interface PaginatedMembersResponse {
    data: MemberDTO[];
    total: number;
}

const now = new Date().toISOString();

const mockMembers: MemberDTO[] = [
    { user_id: 1, group_id: 1, signup_date: "2024-01-15", role_id: 1, status_id: 1, name: "Ana Rodríguez", email: "ana.rodriguez@utp.ac.pa", role_name: "Líder", status_name: "Activo", profile_photo_url: "https://randomuser.me/api/portraits/women/1.jpg", updated_at: now, approved_by: 1 },
    { user_id: 2, group_id: 1, signup_date: "2024-02-20", role_id: 2, status_id: 1, name: "Carlos Sánchez", email: "carlos.sanchez@utp.ac.pa", role_name: "Miembro", status_name: "Activo", profile_photo_url: "https://randomuser.me/api/portraits/men/2.jpg", updated_at: now, approved_by: 1 },
    { user_id: 3, group_id: 1, signup_date: "2024-03-10", role_id: 2, status_id: 2, name: "Laura Gómez", email: "laura.gomez@utp.ac.pa", role_name: "Miembro", status_name: "Inactivo", profile_photo_url: "https://randomuser.me/api/portraits/women/3.jpg", updated_at: now, approved_by: 1 },
    { user_id: 4, group_id: 1, signup_date: "2024-04-05", role_id: 2, status_id: 1, name: "Javier Fernández", email: "javier.fernandez@utp.ac.pa", role_name: "Miembro", status_name: "Activo", profile_photo_url: "https://randomuser.me/api/portraits/men/4.jpg", updated_at: now, approved_by: 1 },
];

class MemberDao {
    async fetchAll(_clubId: number, params: Record<string, any>): Promise<PaginatedMembersResponse> {
        console.log("--- MODO DE PRUEBA DE UI: Devolviendo miembros simulados con filtros ---", params);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredMembers = mockMembers;

        if(params.search) {
            filteredMembers = filteredMembers.filter(m => 
                m.name.toLowerCase().includes(params.search.toLowerCase()) ||
                m.email.toLowerCase().includes(params.search.toLowerCase())
            );
        }
        if(params.status && params.status !== 'all') {
            filteredMembers = filteredMembers.filter(m => m.status_name.toLowerCase() === params.status);
        }
        
        return {
            data: filteredMembers,
            total: filteredMembers.length
        };
    }

    async fetchStats(_clubId: number): Promise<MemberStatsDTO> {
        console.log("--- MODO DE PRUEBA DE UI: Devolviendo estadísticas simuladas ---");
        return { active: 3, newMembers: 1, droppedMembers: 0 };
    }

    async inviteMany(_clubId: number, emails: string[]): Promise<void> {
        console.log("--- MODO DE PRUEBA DE UI: Invitaciones simuladas enviadas a ---", emails);
        return;
    }

    async remove(_clubId: number, userId: number): Promise<void> {
        console.log(`--- MODO DE PRUEBA DE UI: Eliminación simulada del miembro ${userId} ---`);
        return;
    }

    async exportToCSV(_clubId: number): Promise<Blob> {
        console.log("--- MODO DE PRUEBA DE UI: Exportación a CSV simulada ---");
        const csvContent = "user_id,name,email,role_name,status_name\n" + mockMembers.map(m => `${m.user_id},${m.name},${m.email},${m.role_name},${m.status_name}`).join("\n");
        return new Blob([csvContent], { type: 'text/csv' });
    }
}

export default new MemberDao();