// src/stores/useMemberStore.ts
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
        filters: {
            search: '',
            status: 'all', // 'all', 'active', 'inactive'
            role: 'all' // 'all', 'admin', 'moderator', 'member'
        }
    }),
    actions: {
        /** RF5.2.1 - Fetch paginated and filtered members */
        async fetchAll(clubId: number) {
            this.loading = true; this.error = null;
            try {
                const response = await MemberDao.fetchAll(clubId, {
                    page: this.page,
                    pageSize: this.pageSize,
                    ...this.filters
                });
                this.items = response.data;
                this.total = response.total; // Assumes backend sends total count
            } catch (err: any) {
                this.error = err.message;
                useUserStore().showToast(`Error al cargar miembros: ${err.message}`, 'error');
            } finally {
                this.loading = false;
            }
        },
        /** RF5.1.1 - Fetch club statistics */
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
        /** RF5.2.2 - Invite members by email */
        async inviteMany(clubId: number, emails: string[]) {
            this.loading = true; this.error = null;
            const userStore = useUserStore();
            try {
                await MemberDao.inviteMany(clubId, emails);
                userStore.showToast(`${emails.length} invitación(es) enviada(s) exitosamente.`, 'success');
                this.fetchAll(clubId); // Refresh list
            } catch (err: any) {
                this.error = err.message;
                userStore.showToast(`Error al invitar: ${err.message}`, 'error');
            } finally {
                this.loading = false;
            }
        },
        /** RF5.2.2 - Remove a member */
        async remove(clubId: number, userId: number) {
            this.loading = true; this.error = null;
            try {
                await MemberDao.remove(clubId, userId);
                this.items = this.items.filter(m => m.user_id !== userId);
                useUserStore().showToast('Miembro eliminado.', 'success');
            } catch (err: any) {
                this.error = err.message;
                useUserStore().showToast(`Error: ${err.message}`, 'error');
            } finally {
                this.loading = false;
            }
        },
        /** RF5.2.3 - Export members to CSV */
        async exportToCSV(clubId: number) {
            this.loading = true;
            try {
                const csvBlob = await MemberDao.exportToCSV(clubId);
                const url = window.URL.createObjectURL(csvBlob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `members-club-${clubId}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch(err: any) {
                useUserStore().showToast(`Error al exportar: ${err.message}`, 'error');
            } finally {
                this.loading = false;
            }
        }
    }
});