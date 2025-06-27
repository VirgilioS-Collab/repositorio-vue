/**
 * @file src/store/useMemberStore.ts
 * @description Store de Pinia para la gestión de miembros en el panel de admin.
 * - CORREGIDO: Se implementa la lógica completa de las acciones para eliminar
 * errores de "variable no utilizada" y se conectan correctamente con el DAO.
 */
import { defineStore } from 'pinia';
import MemberDao from '@/services/dao/MemberDao';
import type { MemberDTO, MemberStatsDTO } from '@/services/dao/models/Member';
import { useUserStore } from './useUserStore';

export const useMemberStore = defineStore('member', {
  state: () => ({
    items: [] as MemberDTO[],
    stats: null as MemberStatsDTO | null,
    loading: false,
    error: null as string | null,
    page: 1,
    pageSize: 10,
    total: 0,
    filters: { search: '', status: 'all', role: 'all' }
  }),
  actions: {
    /**
     * @action fetchAllForAdmin
     * @description Obtiene la lista paginada y filtrada de miembros para el panel.
     */
    async fetchAllForAdmin(clubId: number) {
      this.loading = true; this.error = null;
      try {
        const response = await MemberDao.fetchAllForAdmin(clubId, {
            page: this.page,
            limit: this.pageSize,
            ...this.filters
        });
        this.items = response.members;
        this.total = response.total;
      } catch (err: any) {
        this.error = err.message;
        useUserStore().showToast(`Error al cargar miembros: ${err.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    /**
     * @action fetchStats
     * @description Obtiene las estadísticas de miembros para el dashboard del club.
     */
    async fetchStats(clubId: number) {
      this.loading = true; this.error = null;
      try {
          this.stats = await MemberDao.fetchStats(clubId);
      } catch (err: any) {
          this.error = err.message;
      } finally {
          this.loading = false;
      }
    },

    /**
     * @action inviteMany
     * @description Llama al DAO para invitar nuevos miembros por correo.
     */
    async inviteMany(clubId: number, emails: string[]) {
        this.loading = true; this.error = null;
        try {
            await MemberDao.inviteMany(clubId, emails);
            useUserStore().showToast(`${emails.length} invitación(es) enviada(s).`, 'success');
            this.fetchAllForAdmin(clubId); // Refresca la lista después de invitar
        } catch (err: any) {
            this.error = err.message;
            useUserStore().showToast(`Error al invitar: ${err.message}`, 'error');
        } finally {
            this.loading = false;
        }
    },
    
    /**
     * @action exportCsv
     * @description Llama al DAO para descargar un archivo CSV con los miembros.
     */
    async exportCsv(clubId: number) {
      this.loading = true;
      try {
        const csvBlob = await MemberDao.exportCsv(clubId);
        const url = window.URL.createObjectURL(csvBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `miembros-club-${clubId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch(err: any) {
        useUserStore().showToast(`Error al exportar: ${err.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },
  }
});