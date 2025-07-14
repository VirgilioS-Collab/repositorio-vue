/**
 * @file src/services/dao/StatsDao.ts
 * @description DAO para operaciones con estadísticas generales.
 */

import http from '@/services/http';
import type { WeeklyActivityHeatmapDTO } from '@/services/dao/models/Stats';

class StatsDao {
  /**
   * Obtiene los datos para el heatmap semanal de actividades de un club.
   */
  static async fetchWeeklyActivityHeatmap(clubId: number): Promise<WeeklyActivityHeatmapDTO[]> {
    const { data } = await http.get<WeeklyActivityHeatmapDTO[]>(`/api/clubs/${clubId}/weekly-activity-heatmap`);
    return data;
  }
}

export default StatsDao;