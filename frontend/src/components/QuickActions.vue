<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload.vue';
import UserDao from '@/services/dao/UserDao';
import type { UserDTO } from '@/services/dao/models/User';

const user = ref<UserDTO | null>(null);
const loading = ref(false);

async function loadUserProfile() {
  loading.value = true;
  try {
    user.value = await UserDao.fetchProfile();
  } catch (error) {
    console.error('Error loading user profile:', error);
    user.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadUserProfile();
});

const userName = computed(() => user.value?.name || '');
const profilePhoto = computed(() => user.value?.profile_photo_url || '');
const userType = computed(() => user.value?.user_type || '');

const userCanCreateContent = computed(() => {
  return userType.value === 'admin' || userType.value === 'leader';
});
</script>

<template>
  <div class="mb-10 p-6 bg-card border border-gray-200 rounded-xl shadow-sm">

    <div v-if="loading">Cargando...</div>

    <div v-else-if="user" class="flex flex-col md:flex-row items-center justify-between gap-4">

      <!-- FOTO + NOMBRE -->
      <div class="flex items-center gap-4">

        <ProfilePictureUpload
          :current-image-url="profilePhoto"
          size="medium"
          :show-upload-button="false"
        />

        <div>
          <h2 class="text-2xl font-bold text-darkText">
            ¡Bienvenida, {{ userName }}!
          </h2>
          <p class="text-gray-500">¿Qué te gustaría hacer hoy?</p>
        </div>
      </div>


      <div class="flex items-center justify-center gap-2 sm:gap-3 shrink-0">

      </div>

    </div>

  </div>
</template>
