<script setup lang="ts">
/**
 * @file src/views/ActivityDetailView.vue
 * @description Vista para mostrar los detalles de una actividad específica.
 * Recibe el ID de la actividad como prop de la ruta.
 */

// Sección de Librerías/Imports
// =============================================================================
// No se necesitan imports adicionales para este placeholder.
// Para un componente real, importarías stores para obtener datos, otros componentes, etc.

// Sección Principal (Script Setup)
// =============================================================================

/**
 * @prop id
 * @description ID de la actividad obtenido de los parámetros de la ruta.
 * @type {string}
 */
defineProps<{ id: string }>();

// Aquí, en un componente real, usarías el 'id' para llamar a una API
// Por ejemplo: const activityStore = useActivityStore(); onMounted(() => activityStore.fetchActivityDetails(props.id));
</script>

<template>
  <div class="p-8 max-w-screen-lg mx-auto">
    <h1 class="text-3xl font-bold text-darkText mb-2">Detalles de la Actividad #{{ id }}</h1>
    <p class="text-gray-600 mt-2 text-lg">Aquí se mostrará la descripción completa, horario, ubicación y participantes de la actividad.</p>
    <div class="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 class="text-xl font-semibold text-primary mb-4">Detalles del Evento</h2>
      <p><strong>Actividad:</strong> Nombre de la Actividad de Ejemplo</p>
      <p><strong>Grupo:</strong> Club de Robótica</p>
      <p><strong>Fecha y Hora:</strong> 25 de julio de 2025, 15:00 PM</p>
      <p><strong>Ubicación:</strong> Laboratorio #305, Edificio FIE</p>
      <p><strong>Descripción:</strong> Esta actividad con ID {{ id }} se centra en...</p>
      <button 
        @click="$router.back()" 
        class="mt-6 px-6 py-2 bg-gray-200 text-darkText rounded-md hover:bg-gray-300 transition-colors font-semibold"
      >
        Volver
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos para esta vista si son necesarios */
</style>