<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">Bienvenido a Agenda Academia</h1>
    <p class="text-gray-600">Selecciona un grupo o navega al dashboard de administración.</p>
    <router-link
        to="/admin"
        class="mt-6 inline-block px-4 py-2 bg-[#00205B] text-white rounded hover:bg-[#00308F]">
      Ir al Dashboard Admin
    </router-link>
  </div>
</template>

<script setup lang="ts">
// Aquí puedes importar cualquier store de Pinia o lógica local
</script>

<style scoped>
/* estilos adicionales si los necesitas */
</style>
