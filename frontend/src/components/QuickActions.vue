<!--
  Componente “QuickActions”
  ------------------------------------------------------------------
  • Muestra los tres accesos rápidos de la pantalla principal:
      1. Crear actividad
      2. Unirme a grupo
      3. Buscar eventos
  • Refactorizado para usar el componente <LucideIcon /> en lugar de SVG
    embebidos, siguiendo el patrón unificado de iconografía.
  ------------------------------------------------------------------ -->

<script setup lang="ts">
import LucideIcon from '@/components/ui/LucideIcon.vue'
import { ICONS }  from '@/utils/icons'
</script>

<template>
  <div
      class="bg-[#00205B] rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,32,91,0.1),0_2px_4px_-1px_rgba(0,32,91,0.06)] p-4 sm:p-6 mb-8"
  >
    <div
        class="action-buttons flex overflow-x-auto whitespace-nowrap sm:flex-wrap sm:justify-center gap-3 sm:gap-4"
    >
      <!-- Crear actividad -->
      <button
          class="flex items-center gap-2 px-4 py-2 bg-[#E4B95B] text-gray-900 rounded-lg hover:bg-yellow-500 transition flex-shrink-0"
      >
        <LucideIcon :name="ICONS.plus"  size="20" />
        <span>Crear actividad</span>
      </button>

      <!-- Unirme a grupo -->
      <button
          class="flex items-center gap-2 px-4 py-2 bg-[#E4B95B] text-gray-900 rounded-lg hover:bg-yellow-500 transition flex-shrink-0"
      >
        <LucideIcon :name="ICONS.users" size="20" />
        <span>Unirme a grupo</span>
      </button>

      <!-- Buscar eventos -->
      <button
          class="flex items-center gap-2 px-4 py-2 bg-[#E4B95B] text-gray-900 rounded-lg hover:bg-yellow-500 transition flex-shrink-0"
      >
        <LucideIcon :name="ICONS.search" size="20" />
        <span>Buscar eventos</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.action-buttons {
  -webkit-overflow-scrolling: touch;
}
/* Oculta la barra de desplazamiento horizontal en navegadores WebKit */
.action-buttons::-webkit-scrollbar {
  display: none;
}
</style>
