/**
 * @file src/services/dao/models/Group.ts
 * @description DTO (Data Transfer Object) para la entidad Grupo/Club.
 */
export interface GroupDTO {
  group_id:              number;
  group_name:            string;
  group_description?:    string;
  group_category_name?:  string;
  member_count?:         number;
  banner_url?:           string;
  logo_url?:             string;

  /**
   * @ARQUITECTURA
   * La propiedad 'activities' se omite intencionadamente.
   * Según la arquitectura, las actividades de un grupo se cargan
   * a través de una llamada separada gestionada por `useActivityStore`.
   */
}