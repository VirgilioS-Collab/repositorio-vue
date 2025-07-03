<script setup lang="ts">
/**
 * @file src/views/GroupListView.vue
 * @description Página para explorar, buscar y filtrar todos los grupos.
 */
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGroupStore } from '@/store/useGroupStore';
import LucideIcon from '@/components/ui/LucideIcon.vue';

const groupStore = useGroupStore();
const { groups, loading } = storeToRefs(groupStore);
const searchTerm = ref('');

onMounted(() => {
  // Asumimos que 'fetchAllGroups' es la acción que busca todos los grupos.
  // La agregaremos al store a continuación.
  groupStore.fetchAllGroups();
});
</script>

<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-darkText">Explorar Grupos</h1>
      <div class="mt-4 max-w-lg relative">
        <input 
          type="text" 
          v-model="searchTerm"
          placeholder="Buscar por nombre o categoría..."
          class="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <LucideIcon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">Cargando grupos...</div>

    <div v-else-if="groups.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="group in groups" :key="group.group_id" class="bg-card border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <h3 class="text-xl font-bold text-primary mb-2">{{ group.group_name }}</h3>
        <p class="text-sm text-gray-600 flex-grow">{{ group.group_description || 'Este grupo no ha añadido una descripción.' }}</p>
        <button class="mt-4 w-full py-2 text-center font-semibold bg-accent text-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
          Unirse al Grupo
        </button>
      </div>
    </div>

    <div v-else class="text-center py-10">No se encontraron grupos.</div>
  </div>
</template>