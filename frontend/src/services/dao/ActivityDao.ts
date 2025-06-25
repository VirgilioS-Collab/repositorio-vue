/**
 * @file src/services/dao/ActivityDao.ts
 * @description Capa de Acceso a Datos para las Actividades.
 * - CORREGIDO: Añadidos datos de prueba para los clubes 3 y 4.
 * - CORREGIDO: El método fetchByGroup ahora simula correctamente el filtrado.
 */
import type { ActivityDTO } from '@/services/dao/models/Activity';

const mockActivities: ActivityDTO[] = [
    // Club 1: Debate
    { activity_id: 101, group_id: 1, activity_name: 'Debate Semanal: IA en la Educación', activity_description: 'Debate sobre las implicaciones éticas y prácticas de la IA.', max_participants: 20, activity_type_id: 1, activity_status_id: 1, creator_id: 1, activity_datetime: '2025-07-15T14:00:00Z', location: 'Salón 3-401', participants_count: 18, activity_type_name: 'Reunión', activity_status_name: 'Programada' },
    { activity_id: 102, group_id: 1, activity_name: 'Taller de Oratoria', activity_description: 'Mejora tus habilidades de comunicación.', max_participants: 15, activity_type_id: 2, activity_status_id: 1, creator_id: 1, activity_datetime: '2025-07-22T16:00:00Z', location: 'Auditorio', participants_count: 15, activity_type_name: 'Taller', activity_status_name: 'Programada' },
    
    // Club 2: Fútbol
    { activity_id: 201, group_id: 2, activity_name: 'Entrenamiento Táctico', activity_description: 'Sesión de entrenamiento enfocada en tácticas de juego.', max_participants: 22, activity_type_id: 3, activity_status_id: 1, creator_id: 2, activity_datetime: '2025-07-18T08:00:00Z', location: 'Cancha Principal', participants_count: 18, activity_type_name: 'Entrenamiento', activity_status_name: 'Programada' },
    { activity_id: 202, group_id: 2, activity_name: 'Venta de Comida Pro-fondos', activity_description: 'Venta de hot dogs y sodas para recaudar fondos para nuevos uniformes.', max_participants: 10, activity_type_id: 4, activity_status_id: 1, creator_id: 2, activity_datetime: '2025-08-01T11:00:00Z', location: 'Cafetería Central', participants_count: 5, activity_type_name: 'Venta de Comida', activity_status_name: 'Programada' },

    // Club 3: Lectura
    { activity_id: 301, group_id: 3, activity_name: 'Discusión: "Cien Años de Soledad"', activity_description: 'Análisis y discusión del libro del mes.', max_participants: 40, activity_type_id: 1, activity_status_id: 1, creator_id: 3, activity_datetime: '2025-07-30T19:00:00Z', location: 'Biblioteca, Sala de Grupos', participants_count: 35, activity_type_name: 'Reunión', activity_status_name: 'Programada' },

    // Club 4: Robótica
    { activity_id: 401, group_id: 4, activity_name: 'Torneo Interno de Sumo-bots', activity_description: 'Competencia interna para probar nuestros nuevos prototipos.', max_participants: 15, activity_type_id: 5, activity_status_id: 2, creator_id: 1, activity_datetime: '2025-06-20T10:00:00Z', location: 'Taller de Robótica', participants_count: 14, activity_type_name: 'Torneo', activity_status_name: 'Realizada' },
];

class ActivityDao {
    async fetchAll(clubId: number): Promise<ActivityDTO[]> {
        console.log(`--- MODO PRUEBA: Devolviendo actividades para el grupo ${clubId} ---`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockActivities.filter(a => a.group_id === clubId);
    }
    
    // Otros métodos como fetchById, create, update, delete irían aquí
}

export default new ActivityDao();