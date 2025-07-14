/**
 * @file src/services/dao/models/Stats.ts
 * @description DTOs para estadísticas generales y gráficas.
 */

/**
 * DTO para el Heat-map semanal de actividades (semana x 24h)
 */
export interface WeeklyActivityHeatmapDTO {
  day_of_week: number; // 0 = Domingo, 1 = Lunes, etc.
  hour_of_day: number; // 0-23
  activity_count: number;
}