<script setup lang="ts">
/**
 * @file src/components/ui/Card.vue
 * @description Un componente de tarjeta base reutilizable que encapsula
 * los estilos comunes de Tailwind para bordes, sombras y fondos.
 */
</script>

<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <slot></slot>
  </div>
</template>