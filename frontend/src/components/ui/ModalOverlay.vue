<script setup lang="ts">
/**
 * @file src/components/ui/ModalOverlay.vue
 * @description Un contenedor genérico para modales que provee un fondo
 * oscuro, efecto de desenfoque y la funcionalidad de cerrar al hacer
 * clic fuera.
 */
import { useUserStore } from '@/store/useUserStore';

const userStore = useUserStore();
</script>

<template>
  <div
    @click.self="userStore.closeAllModals()"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
    aria-modal="true"
    role="dialog"
  >
    <slot></slot>
  </div>
</template>