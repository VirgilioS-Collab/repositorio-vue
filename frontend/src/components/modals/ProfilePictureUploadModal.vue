<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h2 class="text-xl font-semibold mb-4">Cambiar Foto de Perfil</h2>

      <ImageUploader
        :model-value="currentImageUrl"
        label="Arrastra o selecciona tu nueva foto de perfil"
        :is-profile-photo="true"
        :show-upload-button="true"
        @image-uploaded="handleImageUploaded"
        @error="handleError"
      />

      <!-- Botones de acción (si ImageUploader no los maneja internamente o si se necesita lógica adicional) -->
      <div class="flex justify-end gap-4 mt-6">
        <button 
          class="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          @click="closeModal"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ImageUploader from '@/components/ui/ImageUploader.vue';
import { useAuthStore } from '@/store/useAuthStore';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close', 'upload-success']);

const authStore = useAuthStore();

// Usar la URL de la foto de perfil actual del usuario autenticado
const currentImageUrl = ref(authStore.currentUser?.u_profile_photo_url || null);

// Observar cambios en la URL de la foto de perfil del store de autenticación
// para mantener el componente actualizado si la imagen cambia por otras vías
watch(() => authStore.currentUser?.u_profile_photo_url, (newUrl) => {
  currentImageUrl.value = newUrl || null;
});

const closeModal = () => {
  emit('close');
};

const handleImageUploaded = (imageUrl: string) => {
  // Actualizar la URL de la foto de perfil en el store de autenticación
  // Esto ya lo hace imageStore.updateProfilePhotoFile, pero lo confirmamos aquí
  if (authStore.currentUser) {
    authStore.currentUser.u_profile_photo_url = imageUrl;
  }
  emit('upload-success', imageUrl);
  closeModal();
};

const handleError = (message: string) => {
  console.error('Error en la subida de imagen del modal:', message);
  // El toast ya se muestra desde ImageUploader.vue
};

// Sincronizar la visibilidad del modal con la prop
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // Cuando el modal se abre, asegúrate de que la URL actual sea la del usuario
    currentImageUrl.value = authStore.currentUser?.u_profile_photo_url || null;
  }
});
</script>
