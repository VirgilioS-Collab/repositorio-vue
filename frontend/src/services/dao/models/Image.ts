/**
 * @file src/services/dao/models/Image.ts
 * @description DTOs para operaciones con imágenes.
 */

/**
 * DTO para subir imagen
 */
export interface ImageUploadRequestDTO {
  image_data: string; // Base64 encoded image
  title?: string;
  description?: string;
}

/**
 * DTO para respuesta de imagen subida
 */
export interface ImageUploadResponseDTO {
  imageUrl: string;
}

/**
 * DTO para actualizar foto de perfil
 */
export interface ProfilePhotoUpdateDTO {
  image_data: string; // Base64 encoded image
}
