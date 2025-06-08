<!--
  Componente “ActivitiesSection”
  ------------------------------------------------------------------
  • Muestra un resumen de las actividades próximas del usuario.
  • Refactorizado para usar <LucideIcon
  • Recibe la lista de actividades vía props.
  ------------------------------------------------------------------ -->

<script setup lang="ts">
import { defineProps }   from 'vue'
import LucideIcon        from '@/components/ui/LucideIcon.vue'

/* ---------- Tipos ---------- */
interface Activity {
  id:        number
  title:     string
  date:      string   // ISO-8601
  time:      string
  location:  string
  type:      string
  status:    'confirmed' | 'pending'
}

/* ---------- Props ---------- */
defineProps<{ activities: Activity[] }>()

/* ---------- Utilidades ---------- */
function formatDate (iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('es-PA', {
    weekday: 'short',
    day    : 'numeric',
    month  : 'short'
  })
}

function getActivityType (type: string): string {
  const map: Record<string,string> = {
    competition: 'Competencia',
    meeting    : 'Reunión',
    workshop   : 'Taller',
    conference : 'Conferencia',
    study      : 'Estudio'
  }
  return map[type] ?? type
}
</script>

<template>
  <section>
    <!-- Cabecera -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
        <LucideIcon name="calendar" size="24" class="mr-2 text-[#E4B95B]" />
        Mis Actividades
      </h2>

      <button
          class="text-sm bg-[#00205B] text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
      >
        Ver todas
      </button>
    </div>

    <!-- Tarjetas -->
    <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
          v-for="activity in activities"
          :key="activity.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transition"
      >
        <div class="p-4 sm:p-5">
          <!-- Título + estado -->
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-800 text-sm sm:text-base">
              {{ activity.title }}
            </h3>
            <span
                :class="[
                'text-xs px-2 py-1 rounded-full',
                activity.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              ]"
            >
              {{ activity.status === 'confirmed' ? 'Confirmado' : 'Pendiente' }}
            </span>
          </div>

          <!-- Fecha y hora -->
          <div class="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
            <LucideIcon name="calendar" size="16" class="mr-1" />
            {{ formatDate(activity.date) }} • {{ activity.time }}
          </div>

          <!-- Ubicación -->
          <div class="flex items-center text-xs sm:text-sm text-gray-600 mb-3">
            <LucideIcon name="location" size="16" class="mr-1" />
            {{ activity.location }}
          </div>

          <!-- Tipo + acción -->
          <div class="flex justify-between items-center">
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              {{ getActivityType(activity.type) }}
            </span>
            <button
                class="text-xs sm:text-sm bg-[#00205B] text-white px-2 sm:px-3 py-1 rounded-md hover:bg-blue-700 transition"
            >
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Todos los estilos se resuelven con Tailwind; no se añade CSS extra. */
</style>
