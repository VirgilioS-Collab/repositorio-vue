<template>
  <div class="container mx-auto p-4">
    <div class="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Perfil de Usuario</h1>
      
      <div class="flex items-center space-x-6 mb-6">
        <div class="relative">
          <img 
            :src="authStore.currentUser?.u_profile_photo_url || defaultAvatar" 
            alt="Foto de perfil" 
            class="w-24 h-24 rounded-full object-cover"
          />
          <button 
            @click="openProfilePictureUploadModal()"
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
          <h2 class="text-xl font-semibold">{{ authStore.currentUser?.u_name }} {{ authStore.currentUser?.u_last_name }}</h2>
          <p class="text-gray-500">@{{ authStore.currentUser?.u_username }}</p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <p class="mt-1 text-lg text-gray-900">{{ authStore.currentUser?.u_email }}</p>
        </div>
        <BaseButton @click="openEditModal">Editar Perfil</BaseButton>
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-medium text-gray-900">Configuración de Notificaciones</h3>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-gray-700">Recibir notificaciones por correo electrónico</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="emailNotifications" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <ProfilePictureUploadModal 
      :visible="userStore.modals.profilePictureUpload" 
      @close="userStore.closeAllModals()"
      @upload-success="onUploadSuccess"
    />
    
    <EditProfileModal
      v-if="isEditModalVisible"
      @close="closeEditModal"
    />

    <ActivityHistory />
    <ClubList />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import ProfilePictureUploadModal from '@/components/modals/ProfilePictureUploadModal.vue'; // Importar el nuevo modal
import EditProfileModal from '@/components/modals/EditProfileModal.vue';
import ActivityHistory from '@/components/ActivityHistory.vue';
import ClubList from '@/components/ClubList.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import defaultAvatar from '@/assets/vue.svg';

const authStore = useAuthStore();
const userStore = useUserStore();
const isEditModalVisible = ref(false);
const emailNotifications = ref(true);

const onUploadSuccess = (newImageUrl: string) => {
  // La actualización del store ya se maneja dentro de ProfilePictureUploadModal
  // authStore.updateUserProfilePicture(newImageUrl); // Ya no es necesario aquí
  userStore.closeAllModals(); // Cerrar el modal de subida
};

const openEditModal = () => {
  isEditModalVisible.value = true;
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
};

const openProfilePictureUploadModal = () => {
  userStore.openModal('profilePictureUpload');
};
</script>
