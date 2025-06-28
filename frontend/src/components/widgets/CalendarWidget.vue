<script setup lang="ts">
/**
 * @file src/components/widgets/CalendarWidget.vue
 * @description Widget de calendario que muestra las actividades del usuario.
 * - MODIFICADO: Se elimina la opción 'height' y se añade 'dayMaxEventRows'
 * para forzar una proporción correcta y evitar la deformación vertical.
 */
import { computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { ActivityDTO } from '@/services/dao/models/Activity';

const props = defineProps<{
  activities: ActivityDTO[] | undefined;
}>();

const calendarEvents = computed(() => {
  if (!props.activities) return [];
  return props.activities.map(activity => ({
    title: activity.activity_name,
    start: activity.activity_datetime,
    allDay: true,
    // Damos un color a los eventos para que resalten
    backgroundColor: '#E4B95B', // accent
    borderColor: '#E4B95B', // accent
    textColor: '#00205B' // primary
  }));
});

const calendarOptions = {
  plugins: [ dayGridPlugin ],
  initialView: 'dayGridMonth',
  events: calendarEvents.value,
  
  // ELIMINADO: Se quita 'height: "auto"' para que no compita con aspectRatio.
  
  // MANTENIDO: Esta es ahora la regla principal para la forma.
  aspectRatio: 1.5,

  // AÑADIDO: Limita el número de eventos por día para evitar que se estire.
  // Mostrará un enlace "+X más" si hay más eventos.
  dayMaxEventRows: true, 

  headerToolbar: {
    left: 'title',
    center: '',
    right: 'prev,next'
  },
  locale: 'es',
  buttonText: {
    today: 'hoy',
  },
  firstDay: 1, // Opcional: Empieza la semana en Lunes
};
</script>

<template>
  <div class="bg-card border border-gray-200 rounded-xl shadow-sm p-5">
    <h3 class="font-bold text-lg text-darkText flex items-center gap-2 mb-4">
      <LucideIcon name="calendar-check" :size="20" class="text-accent"/>
      Mi Calendario
    </h3>
    <div class="calendar-widget-container">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<style>
/* Estilos globales refinados para sobreescribir FullCalendar.
  No usamos 'scoped' para que puedan afectar a los elementos internos de FullCalendar.
*/
.calendar-widget-container .fc {
  font-family: inherit;
}
.calendar-widget-container .fc .fc-toolbar-title {
  font-size: 1.125rem; /* text-lg */
  font-weight: 700;
  color: #1a202c; /* darkText */
}
.calendar-widget-container .fc .fc-button {
  background-color: transparent !important;
  border: none !important;
  color: #00205B !important; /* primary */
  box-shadow: none !important;
  padding: 0.5rem;
}
.calendar-widget-container .fc .fc-daygrid-day.fc-day-today {
  background-color: rgba(228, 185, 91, 0.15); /* accent con 15% de opacidad */
}
.calendar-widget-container .fc .fc-daygrid-day-number {
  padding: 0.5em;
  font-size: 0.8em;
}
/* Estilo para el enlace "+X más eventos" */
.calendar-widget-container .fc-daygrid-more-link {
  font-size: 0.75rem;
  font-weight: 600;
}
</style>