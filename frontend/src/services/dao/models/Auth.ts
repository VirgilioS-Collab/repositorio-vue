/**
 * @file src/services/dao/models/Auth.ts
 * @description Interfaces y tipos de transferencia de datos (DTOs) para los flujos de autenticación.
 * - REFACTORIZADO: Se han aplicado las convenciones de nombrado PascalCase y se han
 * añadido DTOs explícitos para todos los flujos.
 */

import type { UserDTO } from './User';

/** --- DTOs para Peticiones (Payloads) ---

/**
 * Payload para la petición de login.
 */
export interface LoginDTO {
  email:    string;
  password: string;
}

/**
 * Payload para el registro de un nuevo usuario.
 * @convention Se ha renombrado de 'userEnrollDTO' a 'UserEnrollDTO' para seguir la convención PascalCase.
 */
export interface UserEnrollDTO {
  first_name: string;
  last_name:  string;
  birth_date: string; // Se espera un string en formato ISO 8601
  gender:     string;
  doc_type:   string;
  doc_number: string;
  phone:      string;
  username:   string;
  email:      string;
  password:   string;
}

/**
 * 
 * Payload para solicitar el enlace de recuperación de contraseña.
 * @description Añadido para hacer explícito el contrato del endpoint de forgot-password.
 */
export interface ForgotPasswordDTO {
  email: string;
}

/**
 * Payload para el reseteo de contraseña.
 */
export interface PasswordResetPayload {
  email:             string;
  new_password:      string;
  verification_code: string;
}


// --- DTOs para Respuestas ---

/**
 * La respuesta al login es vacía (void), ya que la sesión se maneja
 * mediante cookies HttpOnly establecidas por el servidor.
 */
export type LoginResponseDTO = void;

/**
 * La respuesta al registro de usuario también es vacía.
 */
export type UserEnrollResponseDTO = void;

/**
 * @NUEVO
 * La respuesta de /auth/me es el perfil completo del usuario.
 * @description Se añade este alias para documentar el contrato de respuesta.
 */
export type MeResponseDTO = UserDTO;