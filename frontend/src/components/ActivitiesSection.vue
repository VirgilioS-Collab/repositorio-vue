<script setup lang="ts">
/**
 * @file src/components/ActivitiesSection.vue
 * @description Muestra una vista previa de las actividades del usuario.
 * - MODIFICADO: El botón "Ver todas" ahora es un RouterLink funcional.
 * - MODIFICADO: Estilos basados exclusivamente en Tailwind CSS.
 * - AÑADIDO: Muestra un mensaje cuando no hay actividades.
 * - REDISEÑADO: Las actividades ahora se muestran en un layout de cuadrícula (cards)
 * para consistencia visual con la sección de grupos.
 * - CORRECCIÓN DEFINITIVA: El botón "Ver Detalles" ahora redirige a 'ActivityDetail'
 * dado que la ruta ha sido añadida al router.
 */
import { RouterLink } from 'vue-router';
import type { ActivityDTO } from '@/services/dao/models/Activity';
import LucideIcon from '@/components/ui/LucideIcon.vue';

defineProps<{
  activities: ActivityDTO[] | undefined;
}>();
</script>

<template>
  <section class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-darkText flex items-center gap-3">
        <LucideIcon name="calendar" class="text-accent" />
        Mis Actividades
      </h2>
      <RouterLink
        :to="{ name: 'ActivityList' }"
        class="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        aria-label="Ver todas mis actividades"
      >
        Ver todas &rarr;
      </RouterLink>
    </div>

    <div v-if="activities && activities.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="activity in activities" 
        :key="activity.activity_id" 
        class="bg-card border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
      >
        <div>
          <p class="text-base font-bold text-primary">{{ activity.activity_name }}</p>
          <span class="text-sm text-gray-500">{{ activity.group_name }}</span>
        </div>
        
        <div class="mt-3 flex items-center justify-between">
          <span class="text-sm text-gray-500 flex items-center gap-1.5">
            <LucideIcon name="calendar" :size="14" class="text-accent" />
            {{ new Date(activity.start_time).toLocaleDateString('es-PA', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </span>
          <RouterLink 
            :to="{ name: 'ActivityDetail', params: { id: activity.activity_id } }" 
            class="px-3 py-1 text-xs font-bold text-white bg-primary rounded-full hover:bg-primary-dark transition-colors"
            aria-label="Ver detalles de la actividad"
          >
            Ver Detalles
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <p class="text-gray-500 mb-2">No tienes próximas actividades inscritas.</p>
      <RouterLink :to="{ name: 'ActivityList' }" class="mt-2 inline-block text-primary font-semibold hover:underline">
        Buscar actividades &rarr;
      </RouterLink>
    </div>
  </section>
</template>