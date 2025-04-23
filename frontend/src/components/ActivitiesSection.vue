<template>
  <section>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
        <!-- Ícono de calendario -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-[#E4B95B]">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        Mis Actividades
      </h2>
      <button class="text-sm bg-[#00205B] text-white px-3 py-1 rounded-md hover:bg-blue-700 transition">
        Ver todas
      </button>
    </div>

    <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
      >
        <div class="p-4 sm:p-5">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-800 text-sm sm:text-base">{{ activity.title }}</h3>
            <span :class="[
              'text-xs px-2 py-1 rounded-full',
              activity.status === 'confirmed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            ]">
              {{ activity.status === 'confirmed' ? 'Confirmado' : 'Pendiente' }}
            </span>
          </div>
          <div class="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
            <!-- Ícono de calendario -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {{ formatDate(activity.date) }} • {{ activity.time }}
          </div>
          <div class="flex items-center text-xs sm:text-sm text-gray-600 mb-3">
            <!-- Ícono de ubicación -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {{ activity.location }}
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              {{ getActivityType(activity.type) }}
            </span>
            <button class="text-xs sm:text-sm bg-[#00205B] text-white px-2 sm:px-3 py-1 rounded-md hover:bg-blue-700 transition">
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  activities: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    status: string;
  }[];
}>();

/**
 * Formatea la fecha al estilo corto en español.
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Traduce el tipo de actividad.
 */
function getActivityType(type: string): string {
  const types: Record<string, string> = {
    competition: 'Competencia',
    meeting: 'Reunión',
    workshop: 'Taller',
    conference: 'Conferencia',
    study: 'Estudio'
  };
  return types[type] ?? type;
}
</script>

<!--  NO USAR ESTO si no has instalado lucide-vue-next -->
<!--
<script>
  // Esto causará error si no ejecutaste: pnpm add lucide-vue-next
  import CalendarIcon from "lucide-vue-next/icons/calendar";
  import LocationIcon from "lucide-vue-next/icons/map-pin";
</script>
-->
