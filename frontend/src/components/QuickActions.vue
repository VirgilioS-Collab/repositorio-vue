<template>
  <div class="bg-[#00205B] rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,32,91,0.1),0_2px_4px_-1px_rgba(0,32,91,0.06)] p-4 sm:p-6 mb-8">
    <div class="action-buttons flex overflow-x-auto whitespace-nowrap sm:flex-wrap sm:justify-center gap-3 sm:gap-4">
      <button
        class="flex items-center space-x-2 px-4 py-2 bg-[#E4B95B] text-gray-900 rounded-lg hover:bg-yellow-500 transition flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Crear actividad</span>
      </button>

      <button
        class="flex items-center space-x-2 px-4 py-2 bg-[#E4B95B] text-gray-900 rounded-lg hover:bg-yellow-500 transition flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>Unirme a grupo</span>
      </button>

      <button
        class="flex items-center space-x-2 px-4 py-2 bg-[#E4B95B] text-gray-900 rounded-lg hover:bg-yellow-500 transition flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Buscar eventos</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// No hay lógica por ahora, es solo una sección de botones visuales.
</script>

<style scoped>
.action-buttons {
  -webkit-overflow-scrolling: touch;
}
.action-buttons::-webkit-scrollbar {
  display: none;
}
</style>
