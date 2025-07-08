<script setup lang="ts">
/**
 * @file src/views/ActivityDetailView.vue
 * @description Muestra el detalle completo de una actividad específica.
 */
import { onMounted } from 'vue';
import { useActivityStore } from '@/store/useActivityStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';

const props = defineProps<{ id: string }>();

const activityStore = useActivityStore();
const { selectedActivity: activity, loading } = storeToRefs(activityStore);

onMounted(() => {
  activityStore.fetchActivityDetails(Number(props.id));
});
</script>

<template>
  <div v-if="activity && !loading" class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
    <header class="pb-6 border-b-2 border-accent">
      <p class="font-semibold text-accent mb-1">{{ activity.group_name }} presenta:</p>
      <h1 class="text-4xl font-extrabold text-darkText tracking-tight">{{ activity.ga_activity_name }}</h1>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
      <div class="md:col-span-2">
        <h2 class="font-bold text-xl mb-3">Descripción del Evento</h2>
        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
          {{ activity.ga_activity_description || 'El organizador no ha proporcionado una descripción detallada para esta actividad.' }}
        </p>
      </div>

      <div class="md:col-span-1 space-y-6">
        <button class="w-full py-3 text-lg font-bold text-white bg-primary rounded-lg hover:bg-primary-dark transition shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Inscribirse
        </button>
        <div class="bg-card border border-gray-200 p-4 rounded-xl space-y-4">
          <div class="flex items-start gap-3"><LucideIcon name="calendar-days" :size="20" class="text-accent mt-1 shrink-0"/><h4 class="font-semibold">Fecha y Hora</h4><p class="text-sm text-gray-600">{{ new Date(activity.schedules?.[0]?.start_date || '').toLocaleString('es-PA', { dateStyle: 'full', timeStyle: 'short' }) }}</p></div>
          <div class="flex items-start gap-3"><LucideIcon name="map-pin" :size="20" class="text-accent mt-1 shrink-0"/><h4 class="font-semibold">Ubicación</h4><p class="text-sm text-gray-600">{{ activity.location || 'Online' }}</p></div>
          <div class="flex items-start gap-3"><LucideIcon name="users-2" :size="20" class="text-accent mt-1 shrink-0"/><h4 class="font-semibold">Capacidad</h4><p class="text-sm text-gray-600">25 / {{ activity.ga_max_participants || '∞' }}</p></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-16">Cargando detalles de la actividad...</div>
</template>