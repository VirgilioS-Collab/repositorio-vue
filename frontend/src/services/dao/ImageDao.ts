/**
 * @file src/services/dao/ImageDao.ts
 * @description DAO para operaciones con imágenes usando la API de backend.
 */

import Http from '@/services/http';
import type { 
  ImageUploadRequestDTO, 
  ImageUploadResponseDTO, 
  ProfilePhotoUpdateDTO 
} from './models/Image';

class ImageDao {
  /**
   * Sube una imagen genérica a /api/images/upload
   */
  static async uploadGenericImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await Http.post('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Actualiza la foto de perfil del usuario autenticado usando FormData
   * Implementa la especificación del endpoint /api/users/profile-picture
   */
  static async updateProfilePhoto(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await Http.post('/api/users/me/change-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Convierte un archivo a Base64 (para vista previa)
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Valida el tamaño y tipo de archivo
   */
  static validateImageFile(file: File): { valid: boolean; message: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: 'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        message: 'El archivo es demasiado grande. Máximo 10MB permitido'
      };
    }

    return {
      valid: true,
      message: 'Archivo válido'
    };
  }
}

export default ImageDao;
