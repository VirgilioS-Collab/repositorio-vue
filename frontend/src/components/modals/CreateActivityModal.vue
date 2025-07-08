<script setup lang="ts">
import { useUserStore } from '@/store/useUserStore';
import LucideIcon from '@/components/ui/LucideIcon.vue';

const userStore = useUserStore();
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">Crear Nueva Actividad</h3>
        <button @click="userStore.closeAllModals()" class="text-gray-500 hover:text-gray-700">
          <LucideIcon name="x" :size="24 as number" />
        </button>
      </div>
      <p>Aquí iría el formulario para crear una nueva actividad...</p>
    </div>
  </div>
</template>