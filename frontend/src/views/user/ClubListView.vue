<script setup lang="ts">
/**
 * @file src/views/ClubListView.vue
 * @description Página para explorar, buscar y filtrar todos los clubs.
 */
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useClubStore } from '@/store/useClubStore';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { RouterLink } from 'vue-router';

const clubStore = useClubStore();
const { clubs, loading } = storeToRefs(clubStore);
const searchTerm = ref('');
const categoryFilter = ref('all');

const filteredClubs = computed(() => {
  return clubs.value.filter(club => {
    const searchMatch = searchTerm.value.trim() === '' ||
      club.g_group_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      club.g_group_description?.toLowerCase().includes(searchTerm.value.toLowerCase());
    
    const categoryMatch = categoryFilter.value === 'all' ||
      club.g_group_category === categoryFilter.value;
      
    return searchMatch && categoryMatch;
  });
});

onMounted(() => {
  clubStore.fetchAllClubs();
});
</script>

<template>
  <div class="p-4 sm:p-6 md:p-8 bg-soft min-h-screen">
    <div class="max-w-screen-xl mx-auto">
      <header class="mb-8 text-center">
        <h1 class="text-4xl font-extrabold text-darkText tracking-tight">Explorar Clubs</h1>
        <p class="mt-2 text-lg text-gray-500">Encuentra comunidades y únete a tus intereses en la UTP.</p>
      </header>
      
      <div class="mb-6 p-4 bg-card rounded-xl shadow-sm border flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-grow w-full">
          <input 
            type="text" 
            v-model="searchTerm"
            placeholder="Buscar por nombre o categoría..."
            class="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <LucideIcon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div class="flex gap-4 w-full md:w-auto">
          <select v-model="categoryFilter" class="input-focus-effect rounded-full px-4 py-2.5 w-full md:w-auto">
            <option value="all">Todas las categorías</option>
            <option value="Academico">Académico</option>
            <option value="Deportivo">Deportivo</option>
            <option value="Cultural">Cultural</option>
            <option value="Social">Social</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>

      <div v-else-if="filteredClubs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="club in filteredClubs" :key="club.club_id" class="bg-card border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <h3 class="text-xl font-bold text-primary mb-2">{{ club.g_group_name }}</h3>
          <p class="text-sm text-gray-600 flex-grow mb-4">{{ club.g_group_description || 'Este club no ha añadido una descripción.' }}</p>
          <RouterLink :to="{ name: 'ClubDetail', params: { id: club.club_id } }" class="mt-auto w-full py-2 text-center font-semibold bg-accent text-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
            Ver Club
          </RouterLink>
        </div>
      </div>

      <div v-else class="text-center py-16 bg-card rounded-xl border border-dashed">
        <LucideIcon name="search-x" :size="48" class="text-gray-400 mx-auto" />
        <h3 class="mt-4 text-xl font-semibold text-darkText">No se encontraron clubs</h3>
        <p class="mt-1 text-gray-500">Intenta ajustar tus filtros de búsqueda.</p>
      </div>

      <!-- Tarjetas de ejemplo (placeholders) -->
      <div v-if="!loading && filteredClubs.length === 0" class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="bg-card border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm animate-pulse">
          <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div class="h-10 bg-gray-300 rounded w-full mt-auto"></div>
        </div>
      </div>
    </div>
  </div>
</template>