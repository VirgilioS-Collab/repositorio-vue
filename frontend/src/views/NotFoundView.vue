<script setup lang="ts">
import { RouterLink } from 'vue-router';
import LucideIcon from '@/components/ui/LucideIcon.vue';
</script>

<template>
  <div class="min-h-screen bg-soft flex items-center justify-center p-4">
    <div class="bg-card rounded-xl shadow-2xl p-8 text-center max-w-md w-full">
      <LucideIcon name="frown" :size="80" class="text-accent mx-auto mb-6" />
      <h1 class="text-5xl font-extrabold text-darkText mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-primary mb-3">Página No Encontrada</h2>
      <p class="text-gray-600 mb-6">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <RouterLink 
        :to="{ name: 'Home' }" 
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <LucideIcon name="home" :size="20" class="mr-2" />
        Volver al Inicio
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* No se necesitan estilos adicionales, Tailwind CSS maneja la mayoría */
</style>