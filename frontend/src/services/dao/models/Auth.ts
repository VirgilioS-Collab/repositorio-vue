/**
 * @file src/services/dao/models/Auth.ts
 * @description DTOs (Data Transfer Objects) para los flujos de autenticación.
 * Este archivo define las estructuras de datos que se utilizan para enviar
 * y recibir información relacionada con la autenticación entre el frontend y el backend.
 * - REFACTORIZADO: Se cambia 'access_token' por 'token' en las interfaces de respuesta
 * para coincidir con la implementación actual del API de backend.
 */

import type { UserDTO } from './User'; 

/**
 * @docstring
 * DTO para la petición de inicio de sesión.
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} password - Contraseña del usuario.
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * @docstring
 * DTO para la petición de registro de un nuevo usuario.
 * Contiene todos los campos necesarios para crear una nueva cuenta de usuario.
 * @property {string} first_name - Primer nombre del usuario.
 * @property {string} last_name - Apellido del usuario.
 * @property {string} birth_date - Fecha de nacimiento del usuario en formato ISO 8601 (YYYY-MM-DD).
 * @property {string} gender - Género del usuario.
 * @property {string} doc_type - Tipo de documento de identificación (e.g., "Cédula", "Pasaporte").
 * @property {string} doc_number - Número del documento de identificación.
 * @property {string} phone - Número de teléfono del usuario.
 * @property {string} username - Nombre de usuario único.
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} password - Contraseña para la nueva cuenta.
 */
export interface UserEnrollDTO {
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  doc_type: string;
  doc_number: string;
  phone: string;
  username: string;
  email: string;
  password: string;
}

/**
 * @docstring
 * DTO para la petición de solicitud de restablecimiento de contraseña.
 * @property {string} email - Correo electrónico del usuario que solicita el restablecimiento.
 */
export interface ForgotPasswordDTO {
  email: string;
}

/**
 * @docstring
 * DTO para la petición de envío de nueva contraseña tras un restablecimiento.
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} verification_code - Código de verificación recibido por correo electrónico.
 * @property {string} new_password - La nueva contraseña deseada.
 */
export interface PasswordResetPayload {
  email: string;
  verification_code: string;
  new_password: string;
}

/**
 * @docstring
 * DTO para la respuesta de una operación de inicio de sesión exitosa.
 * @CORRECCIÓN
 * La respuesta al login ahora contiene la propiedad 'token', que es el JWT
 * para autenticar futuras peticiones.
 * @property {string} token - El token de autenticación JWT.
 */
export interface LoginResponseDTO {
  token: string;
}

/**
 * @docstring
 * DTO para la respuesta de una operación de refresco de token exitosa.
 * @CORRECCIÓN
 * La respuesta del endpoint de refresh también devuelve la propiedad 'token',
 * que es un nuevo JWT.
 * @property {string} token - El nuevo token de autenticación JWT.
 */
export interface RefreshResponseDTO {
  token: string;
}

/**
 * @docstring
 * Tipo de respuesta para la operación de registro de usuario.
 * Es `void` porque el backend no devuelve un cuerpo de respuesta específico
 * tras un registro exitoso, solo un estado HTTP 204 (No Content) o 200 (OK) sin datos.
 */
export type UserEnrollResponseDTO = void;

/**
 * @docstring
 * Tipo de respuesta para la operación de obtener los datos del usuario autenticado ('me').
 * Devuelve un objeto `UserDTO` con la información completa del usuario.
 * @see {@link UserDTO}
 */
export type MeResponseDTO = UserDTO;