<script setup lang="ts">
/**
 * @file src/components/ui/ImageUploader.vue
 * @description Componente reutilizable y centralizado para la subida de imágenes con vista previa,
 * validación y barra de progreso. Utiliza el `useImageStore` para la lógica de subida y estado.
 */

import { ref, computed, watch } from 'vue';
import { useImageStore } from '@/store/useImageStore';
import { useUserStore } from '@/store/useUserStore'; // Para mostrar toasts
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

// Props
interface Props {
  modelValue?: string | null; // URL de la imagen actual (para edición o visualización)
  label?: string;
  aspectRatio?: string; // Ej: '16/9', '1/1'
  maxSizeMB?: number;
  allowedTypes?: string[]; // Ej: ['image/jpeg', 'image/png']
  showPreview?: boolean;
  showUploadButton?: boolean; // Si se muestra el botón de "Subir Imagen"
  isProfilePhoto?: boolean; // Indica si es para foto de perfil (usa updateProfilePhotoFile)
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: 'Arrastra y suelta una imagen aquí o haz clic para seleccionar',
  aspectRatio: 'auto',
  maxSizeMB: 5,
  allowedTypes: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  showPreview: true,
  showUploadButton: true,
  isProfilePhoto: false,
});

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
  (e: 'image-uploaded', url: string): void;
  (e: 'error', message: string): void;
}>();

// Stores
const imageStore = useImageStore();
const userStore = useUserStore(); // Para mostrar toasts

// Estado local
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const selectedFile = ref<File | null>(null);
const localPreviewUrl = ref<string | null>(null); // Para la vista previa del archivo seleccionado localmente

// Computed properties que usan el store
const isUploading = computed(() => imageStore.uploading);
const uploadProgress = computed(() => imageStore.uploadProgress);
const errorMessage = computed(() => imageStore.error);

// URL que se muestra: primero el archivo seleccionado localmente, luego el modelValue
const displayUrl = computed(() => {
  return localPreviewUrl.value || props.modelValue || null;
});

// Watch para actualizar localPreviewUrl si modelValue cambia externamente y no hay archivo local
watch(() => props.modelValue, (newValue) => {
  if (!selectedFile.value) {
    localPreviewUrl.value = newValue;
  }
}, { immediate: true });

// Métodos
function triggerFileInput() {
  fileInput.value?.click();
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

async function onDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    await handleFile(files[0]);
  }
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    await handleFile(file);
  }
}

async function handleFile(file: File) {
  imageStore.clearError(); // Limpiar errores del store
  selectedFile.value = null;
  localPreviewUrl.value = null; // Limpiar preview local anterior

  const validation = imageStore.validateImageFile(file);
  if (!validation.valid) {
    userStore.showToast(validation.message, 'error');
    emit('error', validation.message);
    imageStore.error = validation.message; // Establecer error en el store
    return;
  }

  selectedFile.value = file;
  if (props.showPreview) {
    localPreviewUrl.value = await imageStore.fileToBase64(file);
  }
}

async function uploadImage() {
  if (!selectedFile.value) {
    const msg = 'No hay imagen seleccionada para subir.';
    userStore.showToast(msg, 'warning');
    emit('error', msg);
    imageStore.error = msg;
    return;
  }

  try {
    let resultUrl: string;
    if (props.isProfilePhoto) {
      resultUrl = await imageStore.updateProfilePhotoFile(selectedFile.value);
    } else {
      const response = await imageStore.uploadImageFile(selectedFile.value, props.label, props.label); // Usar label como title/description
      resultUrl = response.imageUrl;
    }
    
    emit('update:modelValue', resultUrl);
    emit('image-uploaded', resultUrl);
    userStore.showToast('Imagen subida exitosamente!', 'success');
    
    // Resetear estado local después de la subida exitosa
    selectedFile.value = null;
    localPreviewUrl.value = resultUrl; // Mostrar la imagen subida como preview final
  } catch (error: any) {
    console.error('Error al subir imagen:', error);
    const msg = error.response?.data?.message || 'Error al subir la imagen.';
    userStore.showToast(msg, 'error');
    emit('error', msg);
    imageStore.error = msg; // Asegurarse de que el error esté en el store
  } finally {
    if (fileInput.value) fileInput.value.value = ''; // Resetear input file
  }
}

function removeImage() {
  selectedFile.value = null;
  localPreviewUrl.value = null;
  imageStore.clearError(); // Limpiar errores del store
  emit('update:modelValue', null);
  if (fileInput.value) fileInput.value.value = ''; // Resetear input file
}

// Exponer métodos para uso externo si es necesario
defineExpose({
  uploadImage,
  removeImage,
  handleFile,
});
</script>

<template>
  <div class="image-uploader-container">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <div
      class="drop-area relative flex items-center justify-center border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200"
      :class="{
        'border-blue-500 bg-blue-50': isDragging,
        'border-red-500 bg-red-50': errorMessage,
        'border-gray-300 bg-gray-50': !isDragging && !errorMessage,
        'cursor-pointer': !isUploading
      }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        :accept="allowedTypes.join(',')"
        @change="handleFileSelect"
      />

      <div v-if="isUploading" class="flex flex-col items-center justify-center w-full h-full">
        <LucideIcon name="loader" class="animate-spin text-primary-dark mb-3" :size="32" />
        <p class="text-primary-dark font-semibold mb-2">Subiendo imagen...</p>
        <div class="w-3/4 bg-gray-200 rounded-full h-2.5">
          <div class="bg-primary h-2.5 rounded-full transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
        </div>
        <span class="text-sm text-gray-600 mt-1">{{ uploadProgress }}%</span>
      </div>

      <div v-else-if="displayUrl && showPreview" class="relative w-full h-full flex items-center justify-center">
        <img :src="displayUrl" alt="Vista previa" class="max-h-64 object-contain rounded-lg" :style="{ aspectRatio: aspectRatio }" />
        <button
          v-if="showUploadButton"
          @click.stop="removeImage"
          class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
          title="Eliminar imagen"
        >
          <LucideIcon name="x" :size="16" />
        </button>
      </div>

      <div v-else class="flex flex-col items-center justify-center text-gray-500">
        <LucideIcon name="image" :size="48" class="mb-3" />
        <p class="text-sm font-medium">{{ label }}</p>
        <p class="text-xs mt-1">Max {{ maxSizeMB }}MB. Tipos: {{ allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ') }}</p>
      </div>
    </div>

    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

    <div v-if="selectedFile && showUploadButton && !isUploading" class="mt-4 flex justify-end gap-2">
      <BaseButton @click="removeImage" variant="secondary">Cancelar</BaseButton>
      <BaseButton @click="uploadImage">Subir Imagen</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.image-uploader-container {
  width: 100%;
}

.drop-area {
  min-height: 150px;
}
</style>

