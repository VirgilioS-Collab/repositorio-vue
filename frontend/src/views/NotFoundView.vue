<script setup lang="ts">
import { RouterLink } from 'vue-router';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { NAME_HOME } from '@/constants/routes';
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
    <LucideIcon name="frown" :size="96" class="text-primary mb-6" />
    <h1 class="text-6xl font-bold mb-4">404</h1>
    <p class="text-xl text-center mb-8">¡Oops! La página que buscas no se pudo encontrar.</p>
    <RouterLink :to="{ name: NAME_HOME }" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
      <LucideIcon name="home" :size="20" class="mr-2" />
      Volver al Inicio
    </RouterLink>
  </div>
</template>

<style scoped>
/* Puedes añadir estilos específicos aquí si es necesario */
</style>