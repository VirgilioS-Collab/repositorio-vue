<template>
  <div class="container mx-auto p-4">
    <div class="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Perfil de Usuario</h1>
      
      <div class="flex items-center space-x-6 mb-6">
        <div class="relative">
          <img 
            :src="authStore.user?.avatar || defaultAvatar" 
            alt="Foto de perfil" 
            class="w-24 h-24 rounded-full object-cover"
          />
          <button 
            @click="isUploaderVisible = true"
            class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition"
            aria-label="Cambiar foto de perfil"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div>
          <h2 class="text-xl font-semibold">{{ authStore.user?.name }} {{ authStore.user?.last_name }}</h2>
          <p class="text-gray-500">@{{ authStore.user?.username }}</p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <p class="mt-1 text-lg text-gray-900">{{ authStore.user?.email }}</p>
        </div>
      </div>
    </div>

    <ImageUploader 
      :visible="isUploaderVisible" 
      @close="isUploaderVisible = false"
      @upload-success="onUploadSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';
import ImageUploader from '@/components/common/ImageUploader.vue';
import defaultAvatar from '@/assets/vue.svg';

const authStore = useAuthStore();
const isUploaderVisible = ref(false);

const onUploadSuccess = (newImageUrl: string) => {
  authStore.updateUserProfilePicture(newImageUrl);
  isUploaderVisible.value = false;
};
</script>
