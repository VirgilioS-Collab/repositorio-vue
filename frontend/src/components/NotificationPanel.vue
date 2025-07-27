<script setup lang="ts">
/**
 * @file src/components/NotificationPanel.vue
 * @description Panel desplegable que muestra las notificaciones recientes.
 */
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const emit = defineEmits(['notification-clicked']);

const rootElement = ref<HTMLElement | null>(null);

// Datos de maqueta para las notificaciones
const notifications = [
  { id: 1, text: 'Tu solicitud para "Club de Robótica" fue aprobada.', time: 'hace 5 min', read: false, type: 'club_approval', targetId: 123 },
  { id: 2, text: 'El evento "Taller de Soldadura" comienza mañana.', time: 'hace 2 horas', read: false, type: 'activity_reminder', targetId: 456 },
  { id: 3, text: 'Juan Pérez te ha mencionado en un comentario.', time: 'hace 1 día', read: true, type: 'mention', targetId: 789 },
];

function handleClickNotification(notification: any) {
  emit('notification-clicked', notification);
}

defineExpose({ rootElement });
</script>

<template>
  <div ref="rootElement" class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-xl bg-card ring-1 ring-black ring-opacity-5 focus:outline-none text-darkText" @click.stop>
    <div class="p-4 border-b border-gray-200">
      <h3 class="font-bold text-lg">Notificaciones</h3>
    </div>
    <div class="py-1">
      <div v-for="notif in notifications" :key="notif.id" @click="handleClickNotification(notif)" class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer" :class="{ 'bg-blue-50': !notif.read }">
        <p class="font-medium text-darkText">{{ notif.text }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ notif.time }}</p>
      </div>
    </div>
    <div class="p-2 border-t border-gray-200 text-center">
      <RouterLink to="#" class="text-sm font-semibold text-primary hover:underline">
        Ver todas las notificaciones
      </RouterLink>
    </div>
  </div>
</template>