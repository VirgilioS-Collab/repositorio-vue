/**
 * @file src/services/dao/models/Auth.ts
 * @description Define los tipos y interfaces (DTOs) para el flujo de autenticación.
 */

import type { UserDTO } from './User'

/**
 * @interface LoginDTO
 * @description Objeto de transferencia de datos para el inicio de sesión.
 */
export interface LoginDTO {
    email:      string;
    password:   string;
}

/**
 * @interface LoginResponseDTO
 * @description Objeto de transferencia de datos para la respuesta del inicio de sesión.
 */
export interface LoginResponseDTO {
    login_success: boolean;
    token?:        string;
    user?:         UserDTO;
    message?:      string;
}

/**
 * @interface userEnrollDTO
 * @description Objeto de transferencia de datos para el registro de un nuevo usuario.
 * Contiene todos los campos del formulario de registro.
 */
export interface userEnrollDTO {
    firstName:          string;
    lastName:           string;
    username:           string;
    email:              string;
    phone:              string;
    docType:            string;
    docNumber:          string;
    birthDate:          string;
    gender:             string;
    password:           string;
    confirmPassword:    string;
}

/**
 * @interface userEnrollResponseDTO
 * @description Objeto de transferencia de datos para la respuesta del registro.
 */
export interface userEnrollResponseDTO {
    enroll_success: boolean;
    message?:       string;
}