<script setup lang="ts">
/**
 * @file src/views/GroupListView.vue
 * @description Página para explorar, buscar y filtrar todos los grupos.
 * - MEJORADO: La lógica de botones ahora es más robusta y cubre todos los estados de membresía.
 * - MEJORADO: El botón de "Unirse" muestra un estado de carga durante la solicitud.
 */
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useGroupStore } from '@/store/useGroupStore';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { RouterLink } from 'vue-router';

const groupStore = useGroupStore();
// Hacemos reactivo el estado `joiningGroupId` para el feedback visual
const { loading, filteredGroups, searchQuery, categoryFilter, statusFilter, joiningGroupId } = storeToRefs(groupStore);

onMounted(() => {
  groupStore.fetchAllGroups();
});

function handleJoinRequest(groupId: number) {
  groupStore.requestToJoin(groupId);
}
</script>

<template>
  <div class="p-4 sm:p-6 md:p-8 bg-soft min-h-screen">
    <div class="max-w-screen-xl mx-auto">
      <header class="mb-8 text-center">
        <h1 class="text-4xl font-extrabold text-darkText tracking-tight">Explorar Grupos</h1>
        <p class="mt-2 text-lg text-gray-500">Encuentra tu comunidad en la UTP. ¡Conéctate, colabora y crece!</p>
      </header>
      
      <div class="mb-6 p-4 bg-card rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-grow w-full">
          <input 
            type="text" 
            :value="searchQuery"
            @input="groupStore.setSearchQuery(($event.target as HTMLInputElement).value)"
            placeholder="Buscar por nombre o descripción..."
            class="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <LucideIcon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div class="flex gap-4 w-full md:w-auto">
          <select 
            :value="categoryFilter"
            @change="groupStore.setCategoryFilter(($event.target as HTMLSelectElement).value)"
            class="input-focus-effect rounded-full px-4 py-2.5 w-full md:w-auto">
            <option value="all">Todas las categorías</option>
            <option value="Académico">Académico</option>
            <option value="Deportivo">Deportivo</option>
            <option value="Cultural">Cultural</option>
          </select>
          <select 
            :value="statusFilter"
            @change="groupStore.statusFilter = ($event.target as HTMLSelectElement).value"
            class="input-focus-effect rounded-full px-4 py-2.5 w-full md:w-auto">
            <option value="all">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-500">Cargando grupos...</p>
      </div>

      <div v-else-if="filteredGroups.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="group in filteredGroups" :key="group.group_id" class="bg-card border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
          <div class="flex-grow">
            <span class="text-xs font-semibold uppercase text-accent bg-accent/10 px-2 py-1 rounded-full">{{ group.group_category_name || 'General' }}</span>
            <h3 class="text-xl font-bold text-primary my-2 truncate" :title="group.group_name">{{ group.group_name }}</h3>
            <p class="text-sm text-gray-600 line-clamp-3">{{ group.group_description || 'Este grupo no ha añadido una descripción.' }}</p>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
             <div class="flex items-center gap-1">
                <LucideIcon name="users" :size="16" />
                <span>{{ group.member_count }}/{{ group.max_members || '∞' }}</span>
             </div>
             <div class="flex items-center gap-1" :class="group.group_status_name === 'Activo' ? 'text-green-600' : 'text-red-600'">
                <LucideIcon name="circle" :size="12" class="fill-current" />
                <span>{{ group.group_status_name }}</span>
             </div>
          </div>
          
          <div class="mt-4 space-y-2">
              <button
                @click="group.is_member || group.has_pending_request ? null : handleJoinRequest(group.group_id)"
                :disabled="joiningGroupId === group.group_id || group.is_member || group.has_pending_request"
                class="w-full flex justify-center items-center gap-2 py-2 text-center font-semibold rounded-lg transition-colors"
                :class="{
                    'bg-primary text-white hover:bg-primary-dark': !group.is_member && !group.has_pending_request,
                    'bg-green-600 text-white cursor-default': group.is_member,
                    'bg-gray-300 text-gray-500 cursor-not-allowed': group.has_pending_request,
                    'opacity-75 cursor-wait': joiningGroupId === group.group_id,
                }"
              >
                  <LucideIcon v-if="joiningGroupId === group.group_id" name="loader" :size="16" class="animate-spin" />
                  <span v-else-if="group.is_member">Ya eres Miembro</span>
                  <span v-else-if="group.has_pending_request">Solicitud Pendiente</span>
                  <span v-else>Unirse al Grupo</span>
              </button>
               <RouterLink :to="{ name: 'GroupDetail', params: { id: group.group_id } }"
                class="block w-full py-2 text-center font-semibold bg-accent text-primary rounded-lg hover:opacity-90 transition-opacity">
                Ver Perfil
              </RouterLink>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16 bg-card rounded-xl border border-dashed">
        <LucideIcon name="search-x" :size="48" class="text-gray-400 mx-auto" />
        <h3 class="mt-4 text-xl font-semibold text-darkText">No se encontraron grupos</h3>
        <p class="mt-1 text-gray-500">Intenta ajustar tus filtros o término de búsqueda.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>