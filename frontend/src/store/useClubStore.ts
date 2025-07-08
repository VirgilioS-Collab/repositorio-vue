/**
 * @file src/store/useClubStore.ts
 * @description Store de Pinia para gestionar el estado de los clubs.
 * Store mejorado con funcionalidades completas para clubs, miembros y solicitudes.
 */
import { defineStore } from 'pinia';
import ClubDao from '@/services/dao/ClubDao';
import type {
  ClubDTO,
  ClubCreateRequestDTO,
  ClubUpdateRequestDTO,
  ClubMemberDTO,
  JoinRequestDTO,
  JoinClubRequestDTO,
  ClubMemberInviteDTO,
  ClubMemberUpdateDTO
} from '@/services/dao/models/Club';
import type { ClubSettingsDTO } from '@/services/dao/models/Admin';

export const useClubStore = defineStore('club', {
  state: () => ({
    clubs: [] as ClubDTO[],
    myClubs: [] as ClubDTO[],
    details: null as ClubDTO | null,
    clubMembers: [] as ClubMemberDTO[],
    joinRequests: [] as JoinRequestDTO[],
    
    // Estados de carga específicos
    loading: false,
    loadingClubs: false,
    loadingMyClubs: false,
    loadingDetails: false,
    loadingMembers: false,
    loadingJoinRequests: false,
    creatingClub: false,
    updatingClub: false,
    joiningClub: false,
    
    error: null as string | null,
  }),

  getters: {
    // Estados de carga
    isLoading: (state) => state.loading,
    isLoadingClubs: (state) => state.loadingClubs,
    isLoadingMyClubs: (state) => state.loadingMyClubs,
    isCreatingClub: (state) => state.creatingClub,
    isJoiningClub: (state) => state.joiningClub,
    
    // Datos
    getAllClubs: (state) => state.clubs,
    getMyClubs: (state) => state.myClubs,
    getClubDetails: (state) => state.details,
    getClubMembers: (state) => state.clubMembers,
    getPendingJoinRequests: (state) => state.joinRequests.filter(req => req.status === 'pending'),
    
    // Búsqueda por ID
    getClubById: (state) => (id: number) => state.clubs.find(club => club.club_id === id),
    
    // Estado de error
    hasError: (state) => !!state.error,
  },

  actions: {
    /**
     * Limpia el estado de error
     */
    clearError(): void {
      this.error = null;
    },

    /**
     * Obtiene todos los clubs disponibles
     */
    async fetchAllClubs(): Promise<void> {
      this.loadingClubs = true;
      this.error = null;
      try {
        this.clubs = await ClubDao.fetchAll();
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al cargar clubs';
        throw err;
      } finally {
        this.loadingClubs = false;
      }
    },

    /**
     * Obtiene los clubs del usuario autenticado
     */
    async fetchMyClubs(): Promise<void> {
      this.loadingMyClubs = true;
      this.error = null;
      try {
        this.myClubs = await ClubDao.getMyClubs();
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al cargar mis clubs';
        throw err;
      } finally {
        this.loadingMyClubs = false;
      }
    },

    /**
     * Busca los detalles de un solo club por su ID
     */
    async fetchDetails(clubId: number): Promise<void> {
      this.loadingDetails = true;
      this.details = null;
      this.error = null;
      try {
        this.details = await ClubDao.fetchDetails(clubId);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al cargar detalles del club';
        console.error(`Error al buscar el club ${clubId}:`, err);
        throw err;
      } finally {
        this.loadingDetails = false;
      }
    },

    /**
     * Crea un nuevo club
     */
    async createClub(clubData: ClubCreateRequestDTO): Promise<ClubDTO> {
      this.creatingClub = true;
      this.error = null;
      try {
        const newClub = await ClubDao.create(clubData);
        
        // Agregar a las listas locales
        this.clubs.unshift(newClub);
        this.myClubs.unshift(newClub);
        
        return newClub;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al crear club';
        throw err;
      } finally {
        this.creatingClub = false;
      }
    },

    /**
     * Actualiza un club existente
     */
    async updateClub(clubId: number, clubData: ClubUpdateRequestDTO): Promise<ClubDTO> {
      this.updatingClub = true;
      this.error = null;
      try {
        const updatedClub = await ClubDao.update(clubId, clubData);
        
        // Actualizar en las listas
        const clubIndex = this.clubs.findIndex(g => g.club_id === clubId);
        if (clubIndex > -1) {
          this.clubs[clubIndex] = updatedClub;
        }
        
        const myClubIndex = this.myClubs.findIndex(g => g.club_id === clubId);
        if (myClubIndex > -1) {
          this.myClubs[myClubIndex] = updatedClub;
        }
        
        // Actualizar detalles si coincide
        if (this.details?.club_id === clubId) {
          this.details = updatedClub;
        }
        
        return updatedClub;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al actualizar club';
        throw err;
      } finally {
        this.updatingClub = false;
      }
    },

    /**
     * Solicita unirse a un club
     */
    async requestJoinClub(clubId: number): Promise<void> {
      this.joiningClub = true;
      this.error = null;
      try {
        await ClubDao.requestJoin({ club_id: clubId });
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al solicitar unión al club';
        throw err;
      } finally {
        this.joiningClub = false;
      }
    },

    /**
     * Obtiene los miembros de un club
     */
    async fetchClubMembers(clubId: number): Promise<void> {
      this.loadingMembers = true;
      this.error = null;
      try {
        this.clubMembers = await ClubDao.getMembers(clubId);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al cargar miembros del club';
        throw err;
      } finally {
        this.loadingMembers = false;
      }
    },

    /**
     * Obtiene las solicitudes de unión de un club
     */
    async fetchJoinRequests(clubId: number): Promise<void> {
      this.loadingJoinRequests = true;
      this.error = null;
      try {
        this.joinRequests = await ClubDao.getJoinRequests(clubId);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al cargar solicitudes de unión';
        throw err;
      } finally {
        this.loadingJoinRequests = false;
      }
    },

    /**
     * Procesa una solicitud de unión (aprobar o rechazar)
     */
    async processJoinRequest(clubId: number, requestId: number, action: 'approve' | 'reject'): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await ClubDao.processJoinRequest(clubId, requestId, action);
        
        // Actualizar la solicitud localmente
        const request = this.joinRequests.find(r => r.request_id === requestId);
        if (request) {
          request.status = action === 'approve' ? 'approved' : 'rejected';
          request.processed_date = new Date().toISOString();
        }
        
        // Si se aprobó, recargar miembros
        if (action === 'approve') {
          await this.fetchClubMembers(clubId);
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al procesar solicitud';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Elimina un club
     */
    async deleteClub(clubId: number): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await ClubDao.delete(clubId);
        
        // Remover de las listas
        this.clubs = this.clubs.filter(g => g.club_id !== clubId);
        this.myClubs = this.myClubs.filter(g => g.club_id !== clubId);
        
        // Limpiar detalles si coincide
        if (this.details?.club_id === clubId) {
          this.details = null;
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al eliminar club';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Limpia el estado del store
     */
    resetState(): void {
      this.clubs = [];
      this.myClubs = [];
      this.details = null;
      this.clubMembers = [];
      this.joinRequests = [];
      this.error = null;
      this.loading = false;
      this.loadingClubs = false;
      this.loadingMyClubs = false;
      this.loadingDetails = false;
      this.creatingClub = false;
      this.joiningClub = false;
    },

    /**
     * Actualiza los ajustes del club.
     */
    async updateSettings(clubId: number, payload: ClubSettingsDTO): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await ClubDao.updateSettings(clubId, payload);
        // Opcional: Actualizar los detalles del club en el store si la API devuelve los datos actualizados
        // await this.fetchDetails(clubId);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al actualizar ajustes del club';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Invita a nuevos miembros a un club.
     */
    async inviteMembers(clubId: number, payload: ClubMemberInviteDTO): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await ClubDao.inviteMembers(clubId, payload);
        // Podrías añadir lógica para mostrar un toast de éxito aquí
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al invitar miembros';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Actualiza el rol o estado de un miembro específico del club.
     */
    async updateClubMember(clubId: number, userId: number, payload: ClubMemberUpdateDTO): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await ClubDao.updateMember(clubId, userId, payload);
        // Opcional: Recargar los miembros del club para reflejar el cambio
        await this.fetchClubMembers(clubId);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al actualizar miembro del club';
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});