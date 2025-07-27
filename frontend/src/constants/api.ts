/**
 * @file src/constants/api.ts
 * @description Centraliza los endpoints de la API para evitar "cadenas mágicas"
 * y facilitar la refactorización y el mantenimiento.
 */

// Endpoints de Autenticación
export const API_AUTH_LOGIN = '/api/auth/login';
export const API_AUTH_REFRESH = '/api/auth/refresh';
export const API_AUTH_ENROLL = '/api/auth/enroll';
export const API_AUTH_FORGOT_PASSWORD = '/api/auth/forgot-password';
export const API_AUTH_SUBMIT_PASSWORD_RESET = '/api/auth/submitPasswordReset';
export const API_AUTH_ME = '/api/auth/me';
export const API_AUTH_LOGOUT = '/api/auth/logout';
export const API_AUTH_VERIFY_PASS_RESET_CODE = '/api/auth/verifyPassResetCode';
export const API_USERS_CHANGE_PASSWORD = '/api/users/me/change-password';

// Endpoints de Usuario
export const API_USERS_ME = '/api/users/me';
export const API_USERS_ME_PHOTO = '/api/users/me/photo';
export const API_USER_ME_ACTIVITIES = '/api/user/me/activities'; // Corregido: singular "user"
export const API_USERS_ME_GROUPS = '/api/users/me/groups';
export const API_USERS_ME_NOTIFICATIONS = '/api/users/me/notifications';
export const API_USER_ME_EVENTS = '/api/user/me/events'; // Corregido: singular "user"

// Endpoints de Actividades
export const API_ACTIVITIES = '/api/activities';
export const API_ACTIVITIES_BY_ID = (id: number) => `/api/activities/${id}`;
export const API_GROUPS_ACTIVITIES = (groupId: number) => `/api/groups/${groupId}/activities`;

// Endpoints adicionales de actividades para usuario
export const API_USER_ME_ACTIVITY_JOIN = (activityId: number) => `/api/user/me/activity/${activityId}`; // Corregido: singular "user"
export const API_USER_ME_ACTIVITY_LEAVE = (activityId: number) => `/api/user/me/activity/${activityId}`; // Corregido: singular "user"

// Endpoints de Grupos
export const API_GROUPS = '/api/groups';
export const API_GROUPS_BY_ID = (id: number) => `/api/groups/${id}`;
export const API_GROUPS_JOIN = (groupId: number) => `/api/groups/${groupId}/join`;
export const API_GROUPS_PHOTO = (groupId: number) => `/api/groups/${groupId}/photo`;

// Endpoints de Administración
export const API_ADMIN_CLUBS_ACTIVITIES = (clubId: number) => `/api/admin/clubs/${clubId}/activities`;
export const API_ADMIN_CLUBS_SETTINGS = (clubId: number) => `/api/admin/clubs/${clubId}/settings`;
export const API_ADMIN_CLUBS_MEMBERS_STATS = (clubId: number) => `/api/admin/clubs/${clubId}/members/stats`;
export const API_ADMIN_CLUBS_MEMBERS_LIST = (clubId: number) => `/api/admin/clubs/${clubId}/members/list`;
export const API_ADMIN_CLUBS_ACTIVITIES_HEATMAP = (clubId: number) => `/api/admin/clubs/${clubId}/activities/weekly-heatmap`;
export const API_ADMIN_CLUBS_ACTIVITIES_ENROLLMENTS = (clubId: number) => `/api/admin/clubs/${clubId}/activities/enrollments`;
export const API_ADMIN_CLUBS_JOIN_REQUESTS = (clubId: number) => `/api/admin/clubs/${clubId}/join-requests`;
export const API_ADMIN_CLUBS_JOIN_REQUEST_BY_ID = (clubId: number, requestId: number) => `/api/admin/clubs/${clubId}/join-requests/${requestId}`;
export const API_ADMIN_CLUBS_MEMBERS_EXPORT = (clubId: number) => `/api/admin/clubs/${clubId}/members/export`;
export const API_ADMIN_ACTIVITIES_BY_ID = (id: number) => `/api/admin/activities/${id}`;
