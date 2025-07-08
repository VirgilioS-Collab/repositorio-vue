<script setup lang="ts">
/**
 * @file src/components/ui/ProfilePictureUpload.vue
 * @description Componente para cambiar la foto de perfil del usuario.
 * Sube la imagen al backend que usa IMGUR y actualiza el estado.
 */
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { useImageValidation } from '@/composables/useImageValidation';
import ImageDao from '@/services/dao/ImageDao';
import LucideIcon from '@/components/ui/LucideIcon.vue';

// Props
interface Props {
  currentImageUrl?: string | null;
  size?: 'small' | 'medium' | 'large';
  showUploadButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  showUploadButton: true
});

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Composables
const { validateImageFile, fileToBase64, compressImage } = useImageValidation();

// Estado local
const isUploading = ref(false);
const previewUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Computed
const displayUrl = computed(() => {
  return previewUrl.value || props.currentImageUrl || authStore.user?.avatar || null;
});

const avatarSize = computed(() => {
  const sizes = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };
  return sizes[props.size];
});

const defaultAvatar = computed(() => {
  const userId = authStore.user?.user_id || 1;
  return `https://i.pravatar.cc/150?u=${userId}`;
});

// Métodos
async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  // Validar archivo
  const validation = validateImageFile(file);
  if (!validation.valid) {
    userStore.showToast(validation.message, 'error');
    return;
  }

  try {
    // Mostrar vista previa
    previewUrl.value = await fileToBase64(file);
    
    // Comprimir imagen antes de subirla
    const compressedFile = await compressImage(file, 0.8);
    
    // Subir imagen
    isUploading.value = true;
    const response = await ImageDao.updateProfilePhoto(compressedFile);
    
    // Actualizar stores
    authStore.updateUserProfilePicture(response.imageUrl);
    if (userStore.user) {
      userStore.user.u_profile_photo_url = response.imageUrl;
    }
    
    userStore.showToast('Foto de perfil actualizada exitosamente', 'success');
    previewUrl.value = null; // Reset preview
    
  } catch (error: any) {
    console.error('Error al subir imagen:', error);
    userStore.showToast(
      error.response?.data?.error || 'Error al actualizar la foto de perfil', 
      'error'
    );
    previewUrl.value = null; // Reset preview on error
  } finally {
    isUploading.value = false;
    // Reset file input
    if (target) target.value = '';
  }
}

function triggerFileSelect() {
  fileInput.value?.click();
}
</script>

<template>
  <div class="relative inline-block">
    <!-- Avatar Display -->
    <div :class="[avatarSize, 'rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 relative']">
      <img 
        v-if="displayUrl"
        :src="displayUrl" 
        :alt="authStore.user?.u_name || 'Usuario'"
        class="w-full h-full object-cover"
        @error="(e) => (e.target as HTMLImageElement).src = defaultAvatar"
      />
      <img 
        v-else
        :src="defaultAvatar" 
        :alt="authStore.user?.u_name || 'Usuario'"
        class="w-full h-full object-cover"
      />
      
      <!-- Loading Overlay -->
      <div v-if="isUploading" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <LucideIcon name="loader" class="text-white animate-spin" :size="20" />
      </div>
    </div>

    <!-- Upload Button -->
    <button 
      v-if="showUploadButton"
      @click="triggerFileSelect"
      :disabled="isUploading"
      class="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      title="Cambiar foto de perfil"
    >
      <LucideIcon name="camera" :size="16" />
    </button>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      @change="handleFileSelect"
      class="hidden"
    />
  </div>
</template>
