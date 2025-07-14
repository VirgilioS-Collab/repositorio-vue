<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h2 class="text-xl font-semibold mb-4">Cambiar Foto de Perfil</h2>

      <!-- Área de carga de imagen -->
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
        @click="triggerFileInput"
        :class="{ 'border-blue-500 bg-blue-50': isDragging }"
      >
        <input type="file" ref="fileInput" class="hidden" @change="onFileSelected" accept="image/*" />
        <div v-if="!previewUrl">
          <p class="text-gray-500">Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
        </div>
        <div v-else>
          <img :src="previewUrl" alt="Vista previa" class="max-h-48 mx-auto rounded" />
        </div>
      </div>

      <!-- Barra de progreso y errores -->
      <div class="mt-4">
        <div v-if="uploading" class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: progress + '%' }"></div>
        </div>
        <div v-if="error" class="text-red-500 text-sm mt-2">
          {{ error }}
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end gap-4 mt-6">
        <button 
          class="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          @click="closeModal"
          :disabled="uploading"
        >
          Cancelar
        </button>
        <button 
          class="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
          @click="uploadImage"
          :disabled="!selectedFile || uploading"
        >
          {{ uploading ? 'Subiendo...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useImageStore } from '@/store/useImageStore';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close', 'upload-success']);

const imageStore = useImageStore();

const visible = ref(props.visible);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isDragging = ref(false);

// Use imageStore's state for uploading, progress, and error
const uploading = imageStore.uploading;
const progress = imageStore.uploadProgress;
const error = imageStore.error;

const closeModal = () => {
  if (imageStore.uploading) return; // Prevent closing if uploading
  resetState();
  emit('close');
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    handleFile(target.files[0]);
  }
};

const onDragOver = (event: DragEvent) => {
  isDragging.value = true;
};

const onDragLeave = (event: DragEvent) => {
  isDragging.value = false;
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer && event.dataTransfer.files[0]) {
    handleFile(event.dataTransfer.files[0]);
  }
};

const handleFile = (file: File) => {
  const validation = imageStore.validateImageFile(file);
  if (!validation.valid) {
    imageStore.error = validation.message;
    return;
  }
  selectedFile.value = file;
  imageStore.error = null; // Clear previous errors
  
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const resetState = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  imageStore.error = null;
  // Note: uploading and progress are managed by the store
};

const uploadImage = async () => {
  if (!selectedFile.value) return;

  try {
    const result = await imageStore.updateProfilePhotoFile(selectedFile.value);
    emit('upload-success', result);
    closeModal();
  } catch (err: any) {
    // Error is already set in the store by updateProfilePhotoFile
    console.error('Error during image upload:', err);
  }
};

</script>
