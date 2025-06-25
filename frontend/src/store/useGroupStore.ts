/**
 * @file src/store/useGroupStore.ts
 * @description Store de Pinia para gestionar el estado de los grupos.
 * - CORRECCIÓN DEFINITIVA: Se restaura la versión completa del store, incluyendo
 * `fetchAllGroups` y los getters/acciones de filtrado para que la página de
 * listado de grupos (`/groups`) vuelva a funcionar.
 */
import { defineStore } from 'pinia';
import GroupDao from '@/services/dao/GroupDao';
import type { GroupDTO } from '@/services/dao/models/Group';
import { useUserStore } from './useUserStore';

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [] as GroupDTO[],
    details: null as GroupDTO | null,
    loading: false,
    error: null as string | null,
    joiningGroupId: null as number | null,
    // Estado para búsqueda y filtros
    searchQuery: '',
    categoryFilter: 'all',
    statusFilter: 'all'
  }),

  getters: {
    filteredGroups(state): GroupDTO[] {
      return state.groups.filter(group => {
        const searchMatch = state.searchQuery.trim() === '' ||
          group.group_name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          group.group_description?.toLowerCase().includes(state.searchQuery.toLowerCase());

        const categoryMatch = state.categoryFilter === 'all' ||
          group.group_category_name?.toLowerCase() === state.categoryFilter.toLowerCase();
        
        const statusMatch = state.statusFilter === 'all' ||
          group.group_status_name?.toLowerCase() === state.statusFilter.toLowerCase();

        return searchMatch && categoryMatch && statusMatch;
      });
    },
    membershipStatus(state): 'member' | 'pending' | 'not_member' {
        const userStore = useUserStore();
        if (!state.details || !userStore.user) return 'not_member';
        if (state.details.is_member) return 'member';
        if (state.details.has_pending_request) return 'pending';
        return 'not_member';
    }
  },

  actions: {
    // Acción para la vista de lista /groups
    async fetchAllGroups() {
      this.loading = true;
      this.error = null;
      try {
        this.groups = await GroupDao.fetchAll();
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    // Acción para la vista de detalle /groups/:id
    async fetchDetails(groupId: number) {
      this.loading = true;
      this.details = null;
      this.error = null;
      try {
        this.details = await GroupDao.fetchDetails(groupId);
      } catch (err: any) {
        this.error = err.message;
        console.error(`Error al buscar el grupo ${groupId}:`, err);
      } finally {
        this.loading = false;
      }
    },
    // Acción para unirse a un grupo
    async requestToJoin(groupId: number) {
        this.joiningGroupId = groupId;
        this.error = null;
        try {
            await GroupDao.join(groupId);
            const groupInList = this.groups.find(g => g.group_id === groupId);
            if (groupInList) {
                groupInList.has_pending_request = true;
            }
            if (this.details && this.details.group_id === groupId) {
                this.details.has_pending_request = true;
            }
            useUserStore().showToast('Solicitud enviada correctamente.', 'success');
        } catch (err: any) {
            this.error = err.message;
            useUserStore().showToast(`Error al enviar la solicitud: ${err.message || 'Error desconocido'}`, 'error');
        } finally {
            this.joiningGroupId = null;
        }
    },
    // Acciones para los filtros
    setSearchQuery(query: string) {
        this.searchQuery = query;
    },
    setCategoryFilter(category: string) {
        this.categoryFilter = category;
    }
  },
});
