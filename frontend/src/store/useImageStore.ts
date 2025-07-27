/**
 * @file src/store/useImageStore.ts
 * @description Store de Pinia para manejo de imágenes.
 * Gestiona la subida de imágenes genéricas y actualización de fotos de perfil.
 */

import { defineStore } from 'pinia';
import ImageDao from '@/services/dao/ImageDao';
import { userService } from '@/services/userService'; // Import userService
import type { 
  ImageUploadRequestDTO, 
  ImageUploadResponseDTO, 
  ProfilePhotoUpdateDTO 
} from '@/services/dao/models/Image';

export const useImageStore = defineStore('image', {
  /**
   * Estado del store de imágenes
   */
  state: () => ({
    uploading: false,
    uploadProgress: 0,
    error: null as string | null,
    lastUploadedUrl: null as string | null,
  }),

  /**
   * Getters del store
   */
  getters: {
    isUploading: (state) => state.uploading,
    hasError: (state) => !!state.error,
    getLastUploadedUrl: (state) => state.lastUploadedUrl,
  },

  /**
   * Acciones del store
   */
  actions: {
    /**
     * Limpia el estado de error
     */
    clearError(): void {
      this.error = null;
    },

    /**
     * Sube una imagen genérica
     */
    async uploadImage(payload: ImageUploadRequestDTO): Promise<ImageUploadResponseDTO> {
      this.uploading = true;
      this.error = null;
      this.uploadProgress = 0;

      try {
        // Simular progreso de subida
        const progressInterval = setInterval(() => {
          if (this.uploadProgress < 90) {
            this.uploadProgress += 10;
          }
        }, 100);

        const result = await ImageDao.uploadImageFromBase64(payload);

        clearInterval(progressInterval);
        this.uploadProgress = 100;

        this.lastUploadedUrl = result.imageUrl;
        return result;
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Error al subir imagen';
        throw e;
      } finally {
        this.uploading = false;
        // Resetear progreso después de un momento
        setTimeout(() => {
          this.uploadProgress = 0;
        }, 1000);
      }
    },

    

    /**
     * Valida un archivo de imagen antes de subirlo
     */
    validateImageFile(file: File): { valid: boolean; message: string } {
      return ImageDao.validateImageFile(file);
    },

    /**
     * Convierte un archivo a Base64
     */
    async fileToBase64(file: File): Promise<string> {
      return ImageDao.fileToBase64(file);
    },

    /**
     * Procesa y sube un archivo de imagen
     */
    async uploadImageFile(file: File, title?: string, description?: string): Promise<ImageUploadResponseDTO> {
      // Validar archivo
      const validation = this.validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      // Convertir a Base64
      const base64Data = await this.fileToBase64(file);

      // Subir imagen
      return this.uploadImage({
        image_data: base64Data,
        title,
        description
      });
    },

    /**
     * Procesa y actualiza la foto de perfil
     */
    async updateProfilePhotoFile(file: File): Promise<string> {
      this.uploading = true;
      this.error = null;
      this.uploadProgress = 0;

      try {
        const response = await ImageDao.updateProfilePhoto(file);

        this.uploadProgress = 100;

        this.lastUploadedUrl = response.imageUrl;
        return response.imageUrl;
      } catch (e: any) {
        this.error = e.message || 'Error al actualizar foto de perfil';
        throw e;
      } finally {
        this.uploading = false;
        setTimeout(() => {
          this.uploadProgress = 0;
        }, 1000);
      }
    },
  },
});
