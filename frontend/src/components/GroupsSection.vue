<script setup lang="ts">
/**
 * @file src/components/GroupsSection.vue
 * @description Muestra una vista previa de los grupos del usuario.
 * - MODIFICADO: Las tarjetas de grupo ahora son RouterLink funcionales
 * para navegar a la página de detalles del grupo.
 * - (Otros MODIFICADOS/AÑADIDOS previos sin cambios)
 */
import { RouterLink } from 'vue-router';
import type { GroupDTO } from '@/services/dao/models/Group';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { useUserStore } from '@/store/useUserStore'; // Importa el store para toggleGroupsView

defineProps<{
  groups: GroupDTO[] | undefined;
  showAllGroups: boolean;
}>();

// Emitir evento para toggleGroupsView, si sigue siendo una prop.
// Si toggleGroupsView es una acción del store, la importarías directamente.
const userStore = useUserStore(); // Asumiendo que la acción está en userStore
</script>

<template>
  <section class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-darkText flex items-center gap-3">
        <LucideIcon name="users" class="text-accent" />
        Mis Grupos
      </h2>
      <button
        @click="userStore.toggleGroupsView()"
        class="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        aria-label="Alternar vista de todos los grupos"
      >
        {{ showAllGroups ? 'Ver menos' : 'Ver todos' }} &rarr;
      </button>
    </div>

    <div v-if="groups && groups.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="group in groups"
        :key="group.group_id"
        :to="{ name: 'GroupDetail', params: { id: group.group_id } }"
        class="block bg-card border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        aria-label="Ver detalles del grupo"
      >
        <h3 class="font-bold text-primary truncate">{{ group.group_name }}</h3>
        <p class="text-sm text-gray-500 mt-1 truncate">{{ group.group_description || 'Sin descripción' }}</p>
      </RouterLink>
    </div>

    <div v-else class="text-center py-8 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <p class="text-gray-500 mb-2">Aún no eres miembro de ningún grupo.</p>
      <RouterLink :to="{ name: 'GroupList' }" class="mt-2 inline-block text-primary font-semibold hover:underline">
        Explorar grupos &rarr;
      </RouterLink>
    </div>
  </section>
</template>