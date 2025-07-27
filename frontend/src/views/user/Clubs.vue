<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">Bienvenido a Agenda Academia</h1>
    <p class="text-gray-600">Selecciona un club o navega al dashboard de administración.</p>
    <router-link
        to="/admin"
        class="mt-6 inline-block px-4 py-2 rounded-md font-semibold transition-colors duration-200 bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
      Ir al Dashboard Admin
    </router-link>
  </div>
</template>

<script setup lang="ts">
// Aquí puedes importar cualquier store de Pinia o lógica local
</script>

