<script setup lang="ts">
defineEmits<{ (e:'show-registration'): void }>()
</script>

<template>
  <header class="bg-[#00205B] h-16 shadow-md flex items-center justify-between px-6 sticky top-0 z-40">
    <div class="flex items-center">
      <i class="fas fa-calendar-alt text-[#FFC72C] text-xl mr-3"></i>
      <span class="text-white text-xl font-bold tracking-tight">Agenda&nbsp;Académica</span>
    </div>
    <button
        @click="$emit('show-registration')"
        class="transition btn-hover-effect bg-[#FFC72C] hover:bg-[#E8B320] text-[#00205B] font-medium py-2 px-4 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#00205B]">
      <i class="fas fa-user-plus mr-2" />
      Nueva&nbsp;Inscripción
    </button>
  </header>
</template>
