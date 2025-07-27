/**
 * @file src/constants/routes.ts
 * @description Centraliza las rutas y nombres de rutas de la aplicación
 * para evitar "cadenas mágicas" y facilitar la refactorización.
 */

// Rutas
export const PATH_ROOT = '/';
export const PATH_LOGIN = '/login';
export const PATH_REGISTER = '/register';
export const PATH_FORGOT_PASSWORD = '/forgot-password';
export const PATH_RESET_PASSWORD = '/reset-password/:token';
export const PATH_CLUBS = '/clubs';
export const PATH_ACTIVITIES = '/activities';
export const PATH_CLUB_DETAIL = '/clubs/:id';
export const PATH_ACTIVITY_DETAIL = '/activities/:id';
export const PATH_ADMIN_CLUB = '/club/:id';
export const PATH_NOT_FOUND = '/:pathMatch(.*)*';

// Nombres de Rutas
export const NAME_LOGIN = 'Login';
export const NAME_REGISTER = 'Register';
export const NAME_FORGOT_PASSWORD = 'ForgotPassword';
export const NAME_RESET_PASSWORD = 'ResetPassword';
export const NAME_HOME = 'Home';
export const NAME_CLUB_LIST = 'ClubList';
export const NAME_ACTIVITY_LIST = 'ActivityList';
export const NAME_CLUB_DETAIL = 'ClubDetail';
export const NAME_ACTIVITY_DETAIL = 'ActivityDetail';
export const NAME_DASHBOARD = 'Dashboard';
export const NAME_MEMBERS = 'Members';
export const NAME_ACTIVITIES = 'Activities';
export const NAME_FINANCE = 'Finance';
export const NAME_SETTINGS = 'Settings';
