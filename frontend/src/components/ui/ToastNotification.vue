<template>
  <div class="fixed bottom-4 right-4 toast z-50">
    <div :class="['px-4 py-2 rounded-md shadow-lg flex items-center', type === 'success' ? 'bg-green-500' : 'bg-red-500']">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-white">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span class="text-white">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
  type: 'success' | 'error'
}>()
</script>

<style scoped>
.toast {
  animation: fadeInOut 3s ease-in-out forwards;
}
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}
</style>
