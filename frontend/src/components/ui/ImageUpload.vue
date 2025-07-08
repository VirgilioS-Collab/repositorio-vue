<template>
  <div class="image-upload-component">
    <!-- Área de drop y selección -->
    <div
      class="upload-area"
      :class="{
        'drag-over': isDragOver,
        'has-error': hasError,
        'uploading': isUploading
      }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @click="triggerFileInput"
    >
      <!-- Input file oculto -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="hidden-input"
      />

      <!-- Contenido del área de upload -->
      <div v-if="!imagePreview && !isUploading" class="upload-content">
        <div class="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
        </div>
        <p class="upload-text">
          <span class="primary-text">Haz clic para seleccionar</span> o arrastra una imagen aquí
        </p>
        <p class="upload-subtitle">PNG, JPG, GIF hasta 10MB</p>
      </div>

      <!-- Loading spinner -->
      <div v-if="isUploading" class="upload-loading">
        <div class="spinner"></div>
        <p class="loading-text">Subiendo imagen...</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
        </div>
        <span class="progress-text">{{ uploadProgress }}%</span>
      </div>

      <!-- Preview de la imagen -->
      <div v-if="imagePreview && !isUploading" class="image-preview">
        <img :src="imagePreview" :alt="fileName" class="preview-image" />
        <div class="preview-overlay">
          <button @click.stop="removeImage" class="remove-btn" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p class="file-name">{{ fileName }}</p>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Botones de acción -->
    <div v-if="showActions && imagePreview && !isUploading" class="action-buttons">
      <button @click="uploadImage" :disabled="isUploading" class="upload-btn" type="button">
        Subir Imagen
      </button>
      <button @click="removeImage" class="cancel-btn" type="button">
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useImageStore } from '@/store/useImageStore';
import type { ImageUploadResponseDTO } from '@/services/dao/models/Image';

// Props
interface Props {
  showActions?: boolean;
  title?: string;
  description?: string;
  autoUpload?: boolean;
  isProfilePhoto?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  autoUpload: false,
  isProfilePhoto: false,
});

// Emits
const emit = defineEmits<{
  imageUploaded: [result: ImageUploadResponseDTO];
  imageSelected: [file: File];
  error: [message: string];
}>();

// Stores
const imageStore = useImageStore();

// Reactive state
const fileInput = ref<HTMLInputElement>();
const isDragOver = ref(false);
const imagePreview = ref<string | null>(null);
const fileName = ref<string>('');
const errorMessage = ref<string>('');
const selectedFile = ref<File | null>(null);

// Computed
const isUploading = computed(() => imageStore.isUploading);
const uploadProgress = computed(() => imageStore.uploadProgress);
const hasError = computed(() => !!errorMessage.value);

// Methods
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
  
  const file = event.dataTransfer?.files[0];
  if (file) {
    processFile(file);
  }
};

const processFile = async (file: File) => {
  // Validar archivo
  const validation = imageStore.validateImageFile(file);
  if (!validation.valid) {
    errorMessage.value = validation.message;
    emit('error', validation.message);
    return;
  }

  // Limpiar errores previos
  errorMessage.value = '';
  imageStore.clearError();

  // Guardar archivo y mostrar preview
  selectedFile.value = file;
  fileName.value = file.name;
  
  // Crear preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  // Emitir evento de selección
  emit('imageSelected', file);

  // Auto-upload si está habilitado
  if (props.autoUpload) {
    await uploadImage();
  }
};

const uploadImage = async () => {
  if (!selectedFile.value) return;

  try {
    let result;
    
    if (props.isProfilePhoto) {
      result = await imageStore.updateProfilePhotoFile(selectedFile.value);
    } else {
      result = await imageStore.uploadImageFile(
        selectedFile.value,
        props.title,
        props.description
      );
    }

    emit('imageUploaded', result as ImageUploadResponseDTO);
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al subir imagen';
    emit('error', errorMessage.value);
  }
};

const removeImage = () => {
  imagePreview.value = null;
  fileName.value = '';
  selectedFile.value = null;
  errorMessage.value = '';
  
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Exponer métodos públicos
defineExpose({
  removeImage,
  uploadImage,
});
</script>


