import http from './http';

export const userService = {
  /**
   * Sube la imagen de perfil del usuario al servidor.
   * @param file El archivo de imagen a subir.
   * @param onUploadProgress Callback para seguir el progreso de la subida.
   * @returns La URL de la nueva imagen de perfil.
   */
  async uploadProfilePicture(file: File, onUploadProgress: (progressEvent: any) => void): Promise<string> {
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await http.post<{ imageUrl: string }>('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error al subir la imagen de perfil:', error);
      throw new Error('No se pudo actualizar la imagen de perfil.');
    }
  },
};
