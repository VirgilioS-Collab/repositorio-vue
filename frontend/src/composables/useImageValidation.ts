/**
 * @file src/composables/useImageValidation.ts
 * @description Composable para validación y manejo de archivos de imagen.
 */

export function useImageValidation() {
  /**
   * Valida el tamaño y tipo de archivo de imagen
   */
  function validateImageFile(file: File): { valid: boolean; message: string } {
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

  /**
   * Convierte un archivo a Base64 (para vista previa)
   */
  function fileToBase64(file: File): Promise<string> {
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
   * Comprime una imagen usando un canvas
   */
  function compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Mantener aspecto ratio, max 1024px
        const maxSize = 1024;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  return {
    validateImageFile,
    fileToBase64,
    compressImage
  };
}
