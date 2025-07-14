import { defineStore } from 'pinia';
import ActivityDao from '@/services/dao/ActivityDao';
import type { ActivityDTO, ActivityEnrollmentStatsDTO, ActivityCreateRequestDTO } from '@/services/dao/models/Activity';

export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [] as ActivityDTO[],
    selectedActivity: null as ActivityDTO | null,
    loading: false,
    error: null as string | null,
    filters: {
      category: null as string | null,
      type: null as string | null,
      dateRange: null as 'today' | 'week' | 'upcoming' | null,
      clubId: null as number | null,
      keyword: null as string | null,
    },
    pagination: {
      page: 1,
      limit: 10,
      hasMore: true,
    },
    enrollmentStats: [] as ActivityEnrollmentStatsDTO[],
  }),

  getters: {
    filteredActivities: (state) => {
      // Lógica de filtrado y búsqueda en el frontend si no se hace en el backend
      // Por ahora, simplemente devuelve las actividades cargadas
      return state.activities;
    },
    isLoading: (state) => state.loading,
    activityError: (state) => state.error,
    getEnrollmentStats: (state) => state.enrollmentStats,
  },

  actions: {
    async fetchEnrollmentStats(clubId: number) {
      this.loading = true;
      this.error = null;
      try {
        this.enrollmentStats = await ActivityDao.fetchEnrollmentStats(clubId);
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchActivities(loadMore: boolean = false) {
      this.loading = true;
      this.error = null;
      try {
        if (loadMore) {
          this.pagination.page++;
        } else {
          this.activities = [];
          this.pagination.page = 1;
          this.pagination.hasMore = true;
        }

        // Aquí se deberían pasar los filtros y la paginación al DAO
        const fetchedActivities = await ActivityDao.fetchAll(); // TODO: Implementar filtros y paginación en DAO
        
        if (loadMore) {
          this.activities.push(...fetchedActivities);
        } else {
          this.activities = fetchedActivities;
        }

        this.pagination.hasMore = fetchedActivities.length === this.pagination.limit; // Asumiendo que el DAO respeta el límite

      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchActivityDetails(id: number) {
      this.loading = true;
      this.error = null;
      try {
        this.selectedActivity = await ActivityDao.fetchById(id);
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async joinActivity(activityId: number) {
      this.loading = true;
      this.error = null;
      try {
        await ActivityDao.join({ activity_id: activityId });
        // Opcional: Actualizar el estado de la actividad o del usuario
        this.showToast('Inscripción exitosa!', 'success');
      } catch (err: any) {
        this.error = err.message;
        this.showToast(`Error al inscribirse: ${err.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async leaveActivity(activityId: number) {
      this.loading = true;
      this.error = null;
      try {
        await ActivityDao.leave(activityId);
        // Opcional: Actualizar el estado de la actividad o del usuario
        this.showToast('Te has desinscrito de la actividad.', 'success');
      } catch (err: any) {
        this.error = err.message;
        this.showToast(`Error al desinscribirse: ${err.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async createActivity(clubId: number, activityData: Partial<ActivityDTO>) {
      this.loading = true;
      this.error = null;
      try {
        // Asegurarse de que activityData tenga la estructura correcta para ActivityCreateRequestDTO
        const createRequest: ActivityCreateRequestDTO = {
          ga_activity_name: activityData.ga_activity_name!,
          ga_activity_description: activityData.ga_activity_description!,
          ga_activity_type: activityData.ga_activity_type!,
          ga_group_id: clubId, // Asegurarse de que el clubId se pase correctamente
          ga_max_participants: activityData.ga_max_participants,
          location: activityData.location,
          schedules: activityData.schedules,
        };
        const newActivity = await ActivityDao.create(clubId, createRequest);
        this.activities.push(newActivity);
        this.showToast('Actividad creada exitosamente!', 'success');
      } catch (err: any) {
        this.error = err.message;
        this.showToast(`Error al crear actividad: ${err.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async updateActivity(activityId: number, activityData: Partial<ActivityDTO>) {
      this.loading = true;
      this.error = null;
      try {
        const updatedActivity = await ActivityDao.update(activityId, activityData);
        const index = this.activities.findIndex(act => act.activity_id === activityId);
        if (index !== -1) {
          this.activities[index] = updatedActivity;
        }
        this.showToast('Actividad actualizada exitosamente!', 'success');
      } catch (err: any) {
        this.error = err.message;
        this.showToast(`Error al actualizar actividad: ${err.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async deleteActivity(activityId: number) {
      this.loading = true;
      this.error = null;
      try {
        await ActivityDao.delete(activityId); // Cambiado de .remove a .delete
        this.activities = this.activities.filter(act => act.activity_id !== activityId);
        this.showToast('Actividad eliminada exitosamente!', 'success');
      } catch (err: any) {
        this.error = err.message;
        this.showToast(`Error al eliminar actividad: ${err.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    setFilter(filterName: keyof typeof this.filters, value: any) {
      this.filters[filterName] = value;
      this.fetchActivities(); // Refrescar actividades con el nuevo filtro
    },

    clearFilters() {
      this.filters = {
        category: null,
        type: null,
        dateRange: null,
        clubId: null,
        keyword: null,
      };
      this.fetchActivities();
    },

    // Pequeña utilidad para mostrar toasts, se puede mover a un store de UI global si es necesario
    showToast(message: string, type: 'success' | 'error' | 'warning', duration: number = 3000){
      // Esto es un placeholder. En una app real, se usaría un sistema de toasts global.
      console.log(`TOAST (${type}): ${message}`);
    },
  },
});
