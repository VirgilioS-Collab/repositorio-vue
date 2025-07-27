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

/**
 * Categorías de clubes disponibles en la aplicación.
 * Centralizar esto previene errores de tipeo y facilita añadir o modificar
 * categorías en el futuro, y asegura consistencia con la base de datos.
 */
export const CLUB_CATEGORIES = [
  { value: 'academic', label: 'Académico' },
  { value: 'sport', label: 'Deportivo' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'art_folklore', label: 'Arte y Folclore' },
  { value: 'tech_innovation', label: 'Tecnología e Innovación' },
  { value: 'volunteering_social', label: 'Voluntariado y Social' },
  { value: 'entrepreneurship', label: 'Emprendimiento' },
  { value: 'research', label: 'Investigación' },
  { value: 'recreation_hobbies', label: 'Recreación y Hobbies' },
  { value: 'international_languages', label: 'Cultura Internacional e Idiomas' }
] as const;

export type ClubCategory = typeof CLUB_CATEGORIES[number]['value'];