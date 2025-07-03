/**
 * @file src/services/dao/models/Activity.ts
 * @description DTO (Data Transfer Object) para la entidad Actividad.
 */
export interface ActivityDTO {
    activity_id:          number;
    activity_name:        string;
    activity_description?: string;
    activity_datetime:    string; // Formato ISO 8601

    // Campos enriquecidos opcionales 
    //location?:             string;
    participants_count?:   number;
    activity_type_name?:   string;
    activity_status_name?: string;
    group_name?:           string;
}