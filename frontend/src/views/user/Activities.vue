<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Mi Calendario de Actividades</h1>
    <CalendarWidget :activities="activities" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import CalendarWidget from '@/components/widgets/CalendarWidget.vue';
import { useActivityStore } from '@/store/useActivityStore';

const activityStore = useActivityStore();
const { activities } = storeToRefs(activityStore);

onMounted(() => {
  // Cargar actividades del usuario al montar el componente
  activityStore.fetchActivities();
});
</script>
