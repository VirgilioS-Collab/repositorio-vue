<script setup lang="ts">
/**
 * @file src/components/modals/SecurityModal.vue
 * @description Modal para gestionar la seguridad de la cuenta del usuario.
 * - MODIFICADO: Se conecta con el `useUserStore` para usar la acción
 * correcta `closeAllModals()` y se elimina el fondo para ser usado
 * dentro de ModalOverlay.
 */
import { ref } from 'vue';
import { useUserStore } from '@/store/useUserStore';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseInput from '@/components/ui/BaseInput.vue';

const userStore = useUserStore();

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

function changePassword() {
  // Aquí iría la lógica para cambiar la contraseña
  console.log('Cambiando contraseña...');
  userStore.closeAllModals();
}
</script>

<template>
  <div class="bg-white rounded-lg w-full max-w-lg shadow-xl">
    
    <div class="flex justify-between items-center p-4 border-b">
      <h3 class="text-lg font-bold text-gray-800">Seguridad y Contraseña</h3>
      <button 
        @click="userStore.closeAllModals()" 
        class="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Cerrar modal"
      >
        <LucideIcon name="x" :size="24 as number" />
      </button>
    </div>

    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-600">
        Para tu seguridad, te recomendamos usar una contraseña única que no uses en otros sitios.
      </p>
      <BaseInput label="Contraseña actual" type="password" autocomplete="current-password" v-model="currentPassword" />
      <BaseInput label="Nueva contraseña" type="password" autocomplete="new-password" v-model="newPassword" />
      <BaseInput label="Confirmar nueva contraseña" type="password" autocomplete="new-password" v-model="confirmPassword" />
    </div>

    <div class="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
      <button @click="userStore.closeAllModals()" class="btn">Cancelar</button>
      <button @click="changePassword" class="btn-primary">Actualizar Contraseña</button>
    </div>
  </div>
</template>