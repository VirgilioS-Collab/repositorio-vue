<script setup lang="ts">
/**
 * @file src/views/ActivityListView.vue
 * @description Página para explorar, buscar y filtrar todas las actividades.
 * - CORREGIDO: Se elimina la lógica incorrecta de 'useGroupStore' y se
 * implementa la lógica correcta usando 'useActivityStore'.
 */
import { onMounted, ref, computed } from 'vue';
import { useActivityStore } from '@/store/useActivityStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { RouterLink } from 'vue-router';

// --- STORES Y ESTADO ---
const activityStore = useActivityStore();
const { list: activities, loading } = storeToRefs(activityStore);

// Estado local para los filtros de esta vista
const searchQuery = ref('');
const categoryFilter = ref('all');

// --- PROPIEDADES COMPUTADAS ---
/**
 * @computed filteredActivities
 * @description Filtra la lista de actividades basándose en los filtros locales.
 */
const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    const searchMatch = searchQuery.value.trim() === '' ||
      activity.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.group_name?.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Asumiendo que tu DTO tiene 'activity_type_name'
    const categoryMatch = categoryFilter.value === 'all' ||
      activity.activity_type === categoryFilter.value;
      
    return searchMatch && categoryMatch;
  });
});

// --- CICLO DE VIDA ---
onMounted(() => {
  // Llama a la acción correcta para buscar todas las actividades
  activityStore.fetchAll(); 
});
</script>

<template>
  <div class="p-4 sm:p-6 md:p-8 bg-soft min-h-screen">
    <div class="max-w-screen-xl mx-auto">
      <header class="mb-8 text-center">
        <h1 class="text-4xl font-extrabold text-darkText tracking-tight">Explorar Actividades</h1>
        <p class="mt-2 text-lg text-gray-500">Participa en los eventos que mueven a la comunidad UTP.</p>
      </header>
      
      <div class="mb-6 p-4 bg-card rounded-xl shadow-sm border flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-grow w-full">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Buscar por nombre o club organizador..."
            class="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <LucideIcon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div class="flex gap-4 w-full md:w-auto">
          <select v-model="categoryFilter" class="input-focus-effect rounded-full px-4 py-2.5 w-full md:w-auto">
            <option value="all">Todas las categorías</option>
            <option value="Taller">Taller</option>
            <option value="Deportivo">Deportivo</option>
            <option value="Cultural">Cultural</option>
            <option value="Académico">Académico</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>

      <div v-else-if="filteredActivities.length > 0" class="space-y-4">
        <div v-for="activity in filteredActivities" :key="activity.activity_id" class="bg-card border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-xl transition-shadow">
          <div>
            <span class="text-xs font-bold uppercase text-accent">{{ activity.group_name }}</span>
            <h3 class="text-xl font-bold text-primary">{{ activity.title }}</h3>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
              <span class="flex items-center gap-1.5"><LucideIcon name="calendar-days" :size="16"/> {{ new Date(activity.schedules?.[0]?.start_date || '').toLocaleDateString('es-PA') }}</span>
              <span class="flex items-center gap-1.5"><LucideIcon name="map-pin" :size="16"/> {{ activity.location || 'Online' }}</span>
            </div>
          </div>
          <RouterLink :to="{ name: 'ActivityDetail', params: { id: activity.activity_id } }" class="mt-4 sm:mt-0 flex-shrink-0 px-6 py-2 text-center font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark">
            Ver Detalles
          </RouterLink>
        </div>
      </div>

      <div v-else class="text-center py-16 bg-card rounded-xl border border-dashed">
        <LucideIcon name="search-x" :size="48" class="text-gray-400 mx-auto" />
        <h3 class="mt-4 text-xl font-semibold text-darkText">No se encontraron actividades</h3>
        <p class="mt-1 text-gray-500">Intenta ajustar tus filtros de búsqueda.</p>
      </div>
    </div>
  </div>
</template>