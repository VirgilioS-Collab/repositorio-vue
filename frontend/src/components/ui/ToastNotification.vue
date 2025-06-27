<script setup lang="ts">
/**
 * @file src/components/ui/ToastNotification.vue
 * @description Componente de notificación flotante (toast).
 * - AÑADIDO: Soporte para el tipo 'warning' y animaciones de entrada/salida.
 */
import { computed } from 'vue';
import LucideIcon from '@/components/ui/LucideIcon.vue';

const props = defineProps<{
  message: string;
  type: 'success' | 'error' | 'warning';
}>();

/**
 * @computed iconAndColor
 * @description Devuelve el icono y las clases de color correctas
 * según el tipo de notificación.
 */
const iconAndColor = computed(() => {
  switch (props.type) {
    case 'success':
      return { icon: 'check-circle-2', color: 'bg-green-600' };
    case 'error':
      return { icon: 'alert-circle', color: 'bg-red-600' };
    case 'warning':
      return { icon: 'alert-triangle', color: 'bg-yellow-500' };
    default:
      return { icon: 'info', color: 'bg-gray-800' };
  }
});
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div class="fixed bottom-5 right-5 z-[100] w-full max-w-sm">
      <div 
        :class="iconAndColor.color"
        class="flex items-center gap-4 text-white px-4 py-3 rounded-lg shadow-2xl"
      >
        <LucideIcon :name="iconAndColor.icon" :size="24" />
        <p class="font-semibold">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>