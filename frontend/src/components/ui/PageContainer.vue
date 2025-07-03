<script setup lang="ts">
/**
 * @file src/components/ui/PageContainer.vue
 * @description Un componente de layout reutilizable para estandarizar la estructura
 * y el encabezado de las páginas principales de la aplicación.
 * @props
 * - title: string (obligatorio) - El título principal que se mostrará en la cabecera de la página.
 * - subtitle?: string (opcional) - Un subtítulo o descripción opcional que aparece debajo del título.
 * @slot (default) - Para el contenido principal que se renderizará dentro del contenedor de la página.
 */
defineProps<{
  /**
   * El título principal que se mostrará en la cabecera de la página.
   */
  title: string;
  /**
   * Un subtítulo o descripción opcional que aparece debajo del título.
   */
  subtitle?: string;
}>();
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800">{{ title }}</h1>
      <p v-if="subtitle" class="text-lg text-gray-600 mt-2">{{ subtitle }}</p>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>