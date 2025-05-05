<!-- src/layouts/DefaultLayout.vue -->
<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <AppNavbar />
  <!-- Empujamos el contenido para no quedar bajo la navbar -->
  <div class="pt-16">
    <RouterView />
  </div>
</template>
