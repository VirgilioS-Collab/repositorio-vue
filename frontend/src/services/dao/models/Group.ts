/**
 * @file src/services/dao/models/Group.ts
 * @description DTO (Data Transfer Object) para la entidad Grupo/Club.
 * Este modelo refleja el contrato con el backend para los detalles de un grupo.
 */
export interface GroupDTO {
  group_id:              number;
  group_name:            string;
  group_description?:    string;
  group_category_name?:  string; // Campo enriquecido por el backend
  member_count?:         number; // Campo enriquecido por el backend
  banner_url?:           string;
  logo_url?:             string;

  /**
   * @ARQUITECTURA
   * La propiedad 'activities' se omite intencionadamente.
   * Según nuestra arquitectura final, las actividades de un grupo se cargan
   * a través de una llamada separada gestionada por `useActivityStore`.
   * Esto mantiene los modelos limpios (SRP) y la carga de datos más eficiente.
   */
}