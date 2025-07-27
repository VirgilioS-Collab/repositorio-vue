/**
 * @file src/services/dao/StatsDao.ts
 * @description DAO para operaciones con estadísticas generales.
 */

import http from '@/services/http';
import { API_ADMIN_CLUBS_ACTIVITIES_HEATMAP } from '@/constants/api';
import type { WeeklyActivityHeatmapDTO } from '@/services/dao/models/Stats';

class StatsDao {
  /**
   * Obtiene los datos para el heatmap semanal de actividades de un club.
   * GET /api/admin/clubs/{clubId}/activities/weekly-heatmap
   */
  static async fetchWeeklyActivityHeatmap(clubId: number): Promise<WeeklyActivityHeatmapDTO[]> {
    const { data } = await http.get<WeeklyActivityHeatmapDTO[]>(API_ADMIN_CLUBS_ACTIVITIES_HEATMAP(clubId));
    return data;
  }
}

export default StatsDao;