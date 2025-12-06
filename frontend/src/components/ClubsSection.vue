<script setup lang="ts">
/**
 * @file src/components/ClubsSection.vue
 * @description Muestra una vista previa de los clubs del usuario.
 * Consume el endpoint GET /api/users/me/groups
 */
import { RouterLink, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import type { ClubDTO } from '@/services/dao/models/Club';
import ClubDao from '@/services/dao/ClubDao';
import LucideIcon from '@/components/ui/LucideIcon.vue';

const clubs = ref<ClubDTO[]>([]);
const loading = ref(false);
const router = useRouter();

async function loadMyClubs() {
  loading.value = true;
  try {
    clubs.value = await ClubDao.getMyClubs();
  } catch (error) {
    console.error('Error loading my clubs:', error);
    clubs.value = [];
  } finally {
    loading.value = false;
  }
}

function handleExploreClubs() {
  router.push({ name: 'ClubList' });
}

onMounted(() => {
  loadMyClubs();
});
</script>

<template>
  <section class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-darkText flex items-center gap-3">
        <LucideIcon name="users" class="text-accent" />
        Mis Clubs
      </h2>
      <button
        @click="handleExploreClubs"
        class="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        aria-label="Ver todos los clubs"
      >
        Ver todos
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="clubs && clubs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="club in clubs.slice(0, 6)"
        :key="club.club_id || club.group_id"
        :to="{ name: 'ClubDetail', params: { id: club.club_id || club.group_id } }"
        class="block bg-card border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        aria-label="Ver detalles del club"
      >
        <h3 class="font-bold text-primary truncate">{{ club.group_name || club.group_name }}</h3>
        <p class="text-sm text-gray-500 mt-1 truncate">{{ club.group_description || club.group_description || 'Sin descripción' }}</p>
      </RouterLink>
    </div>

    <div v-else class="text-center py-8 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <p class="text-gray-500 mb-2">Aún no eres miembro de ningún club.</p>
      <button @click="handleExploreClubs" class="mt-2 inline-block text-primary font-semibold hover:underline">
        Explorar clubs
      </button>
    </div>
  </section>
</template>