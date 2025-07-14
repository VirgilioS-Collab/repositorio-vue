<template>
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4">Mis Clubs</h2>
    <div class="bg-white shadow-md rounded-lg p-4">
      <ul class="divide-y divide-gray-200">
        <li v-for="club in clubs" :key="club.id" class="py-4 flex justify-between items-center">
          <div>
            <p class="text-lg font-semibold">{{ club.name }}</p>
            <p class="text-sm text-gray-500">{{ club.category }}</p>
          </div>
          <span :class="club.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
            {{ club.status }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Datos de ejemplo
const clubs = ref([
  { id: 1, name: 'Club de Programación', category: 'Académico', status: 'Activo' },
  { id: 2, name: 'Club de Debate', category: 'Académico', status: 'Activo' },
  { id: 3, name: 'Equipo de Fútbol', category: 'Deportivo', status: 'En pausa' },
]);
</script>
