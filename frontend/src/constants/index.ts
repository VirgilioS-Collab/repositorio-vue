/**
 * @file src/constants/index.ts
 * @description Centraliza las constantes y enumeraciones de la aplicación.
 */

/**
 * Categorías de actividades utilizadas como fallback inicial en el store
 * y para poblar los filtros en las vistas. 
 * Centralizar esto previene errores de tipeo y facilita añadir o modificar 
 * categorías en el futuro.
 */
export const ACTIVITY_CATEGORIES = [
  'Taller',
  'Conferencia',
  'Cultural',
  'Deportivo',
  'Hackatón',
  'Social'
] as const; 

// Se exporta el tipo para poder usarlo en otros componentes si es necesario.
export type ActivityCategory = typeof ACTIVITY_CATEGORIES[number];