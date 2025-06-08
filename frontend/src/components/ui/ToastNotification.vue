<!--
  ------------------------------------------------------------------
  Pequeña notificación flotante ( *toast* ) que aparece en la esquina
  inferior-derecha para mostrar mensajes de éxito o error y desaparece
  automáticamente tras 3 s.
  • Usa el wrapper <LucideIcon> para mantener la iconografía unificada
  • El color de fondo y el ícono cambian según el tipo (`success|error`)
  ------------------------------------------------------------------ -->

<script setup lang="ts">
import LucideIcon from '@/components/ui/LucideIcon.vue'

/* --- props --------------------------------------------------------- */
defineProps<{
  message: string
  type: 'success' | 'error'
}>()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 animate-toast">
    <div
        class="px-4 py-2 rounded-md shadow-lg flex items-center text-white gap-2"
        :class="type === 'success' ? 'bg-green-500' : 'bg-red-500'"
    >
      <!-- Ícono dinámico -->
      <LucideIcon :name="type === 'success' ? 'check-circle' : 'alert-circle'" size="18" />
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInOut {
  0%   { opacity: 0; transform: translateY(20px); }
  10%  { opacity: 1; transform: translateY(0);     }
  90%  { opacity: 1; transform: translateY(0);     }
  100% { opacity: 0; transform: translateY(-20px); }
}

.animate-toast {
  animation: fadeInOut 3s ease-in-out forwards;
}
</style>

