<script setup lang="ts">
import LucideIcon from '@/components/ui/LucideIcon.vue';
// Datos de maqueta para las notificaciones
const notifications = [
  { id: 1, text: 'Tu solicitud para "Club de Robótica" fue aprobada.', time: 'hace 5 min' },
  { id: 2, text: 'El evento "Taller de Soldadura" comienza mañana.', time: 'hace 2 horas' },
  { id: 3, text: 'Recibiste un nuevo mensaje de Juan Pérez.', time: 'hace 1 día' },
];
</script>
<template>
  <div class="bg-card border border-gray-200 rounded-xl shadow-sm p-5">
    <h3 class="font-bold text-lg text-darkText flex items-center gap-2 mb-4">
      <LucideIcon name="bell" :size="20" class="text-accent"/>
      Notificaciones
    </h3>
    <div class="space-y-3">
      <div v-for="notif in notifications" :key="notif.id" class="text-sm border-l-4 border-accent pl-3">
        <p class="text-darkText">{{ notif.text }}</p>
        <p class="text-xs text-gray-400">{{ notif.time }}</p>
      </div>
    </div>
  </div>
</template>