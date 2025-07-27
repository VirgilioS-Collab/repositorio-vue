/**
 * @file src/services/dao/UserDao.ts
 * @description Capa de Acceso a Datos para el modelo de Usuario.
 * Implementa todos los endpoints de User Features según la especificación del backend.
 */
import http from '@/services/http';
import * as API_ENDPOINTS from '@/constants/api';
import type { UserDTO, UserUpdateDTO, NotificationDTO } from '@/services/dao/models/User';
import type { SimpleActivityDTO } from '@/services/dao/models/Activity';
import type { GroupDTO } from '@/services/dao/models/Group';

class UserDao {
    /**
     * Obtiene el perfil completo del usuario autenticado.
     */
    static async fetchProfile(): Promise<UserDTO> {
        const { data } = await http.get<UserDTO>('/api/auth/me');
        return data;
    }

    /**
     * Actualiza la información personal del usuario autenticado.
     * PUT /api/users/me
     */
    static async updateProfile(payload: UserUpdateDTO): Promise<UserDTO> {
        const { data } = await http.put<UserDTO>(API_ENDPOINTS.API_USERS_ME, payload);
        return data;
    }

    /**
     * Cambia la foto de perfil del usuario autenticado.
     * PUT /api/users/me/photo
     */
    static async updatePhoto(photoFile: File): Promise<UserDTO> {
        const formData = new FormData();
        formData.append('photo', photoFile);
        const { data } = await http.put<UserDTO>(API_ENDPOINTS.API_USERS_ME_PHOTO, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    }

    /**
     * Cambia la contraseña del usuario autenticado.
     * POST /api/users/me/change-password
     */
    static async changePassword(current_password: string, new_password: string): Promise<void> {
        await http.post(API_ENDPOINTS.API_USERS_CHANGE_PASSWORD, { current_password, new_password });
    }

    /**
     * Obtiene las actividades del usuario autenticado.
     * GET /api/users/me/activities
     */
    static async getMyActivities(options?: { signal?: AbortSignal }): Promise<SimpleActivityDTO[]> {
        const { data } = await http.get<SimpleActivityDTO[]>(API_ENDPOINTS.API_USER_ME_ACTIVITIES, options);
        return data;
    }

    /**
     * Obtiene los grupos del usuario autenticado.
     * GET /api/users/me/groups
     */
    static async getMyGroups(options?: { signal?: AbortSignal }): Promise<GroupDTO[]> {
        const { data } = await http.get<GroupDTO[]>(API_ENDPOINTS.API_USERS_ME_GROUPS, options);
        return data;
    }

    /**
     * Obtiene las notificaciones del usuario autenticado.
     * GET /api/users/me/notifications
     */
    static async getNotifications(options?: { signal?: AbortSignal }): Promise<NotificationDTO[]> {
        const { data } = await http.get<NotificationDTO[]>(API_ENDPOINTS.API_USERS_ME_NOTIFICATIONS, options);
        return data;
    }

    /**
     * Marca las notificaciones como leídas.
     * PUT /api/users/me/notifications
     */
    static async markNotificationsAsRead(notificationIds: number[]): Promise<void> {
        await http.put(API_ENDPOINTS.API_USERS_ME_NOTIFICATIONS, { notification_ids: notificationIds });
    }

    /**
     * Obtiene los próximos eventos del usuario autenticado.
     * GET /api/users/me/events
     */
    static async getMyEvents(options?: { signal?: AbortSignal }): Promise<SimpleActivityDTO[]> {
        const { data } = await http.get<SimpleActivityDTO[]>(API_ENDPOINTS.API_USER_ME_EVENTS, options);
        return data;
    }

    /**
     * Se une a una actividad específica.
     * POST /api/users/me/activity/{activityId}
     */
    static async joinActivity(activityId: number): Promise<void> {
        await http.post(API_ENDPOINTS.API_USER_ME_ACTIVITY_JOIN(activityId));
    }

    /**
     * Se sale de una actividad específica.
     * PUT /api/users/me/activity/{activityId}
     */
    static async leaveActivity(activityId: number): Promise<void> {
        await http.put(API_ENDPOINTS.API_USER_ME_ACTIVITY_LEAVE(activityId));
    }
}

export default UserDao;