<script setup lang="ts">
/**
 * @file src/components/ui/StateRenderer.vue
 * @description Componente genérico para manejar y renderizar estados
 * de carga, error y datos, limpiando la lógica de las vistas.
 * Utiliza slots para permitir la personalización de cada estado.
 */
defineProps<{
  /**
   * Booleano que indica si la operación de carga está en curso.
   */
  loading: boolean;
  /**
   * Un string con el mensaje de error si la operación falló, o null si no hay error.
   */
  error: string | null;
}>();
</script>

<template>
  <div v-if="loading" class="text-center py-10 text-gray-500">
    <slot name="loading">
      <p>Cargando...</p>
    </slot>
  </div>

  <div v-else-if="error" class="p-4 text-red-800 bg-red-100 rounded-lg">
    <slot name="error" :error="error">
      <p><span class="font-bold">Error:</span> {{ error }}</p>
    </slot>
  </div>

  <div v-else>
    <slot></slot>
  </div>
</template>