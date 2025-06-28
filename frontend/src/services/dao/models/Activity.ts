/**
 * @file src/services/dao/models/Activity.ts
 * @description Define la interfaz (DTO) para los objetos de Actividad.
 * - AÑADIDO: Se exportan los tipos 'ActivityCreateDTO' y 'ActivityUpdateDTO'
 * para ser utilizados en los formularios de creación y edición del panel de admin.
 */
export interface ActivityDTO {
    activity_id: number;
    activity_name: string;
    activity_description?: string;
    max_participants?: number;
    activity_type_id: number;
    activity_status_id: number;
    group_id: number;
    creator_id: number;

    // --- Campos Adicionales para la UI ---
    activity_datetime: string; 
    location?: string;
    participants_count?: number;
    activity_type_name?: string;
    activity_status_name?: string;
    group_name?: string;
}

/**
 * @type ActivityCreateDTO
 * @description Define la estructura de datos necesaria para crear una nueva actividad.
 * Se omiten campos que son generados por el servidor (como 'activity_id').
 */
export type ActivityCreateDTO = Omit<ActivityDTO,
  | 'activity_id'
  | 'creator_id'
  | 'participants_count'
  | 'activity_type_name'
  | 'activity_status_name'
  | 'group_name'
>;

/**
 * @type ActivityUpdateDTO
 * @description Define la estructura de datos para actualizar una actividad.
 * Todos los campos son opcionales (`Partial<>`) ya que el administrador
 * podría querer actualizar solo una parte del evento.
 */
export type ActivityUpdateDTO = Partial<ActivityCreateDTO>;