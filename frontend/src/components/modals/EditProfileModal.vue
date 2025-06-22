<script setup lang="ts">
/**
 * @file src/components/modals/EditProfileModal.vue
 * @description Modal para editar la información del usuario.
 * - Utiliza la arquitectura correcta: sin fondo propio y usando acciones del store.
 * - Mantiene el diseño simple con los 3 campos solicitados.
 */
import { reactive } from 'vue';
import { useUserStore } from '@/store/useUserStore';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseInput from '@/components/ui/BaseInput.vue';

// Obtenemos la instancia del store.
const userStore = useUserStore();

// Creamos un formulario reactivo solo con los campos necesarios.
// Se inicializa con los datos actuales del usuario desde el store.
const form = reactive({
  name: userStore.user?.name || '',
  email: userStore.user?.email || '',
  // NOTA: 'career' no está en el modelo UserDTO. Para que se guarde,
  // debes añadirlo a las interfaces UserDTO y UserUpdateDTO en 'User.ts'.
  career: (userStore.user as any)?.career || '',
});

/**
 * @docstring
 * Guarda los cambios llamando a la acción del store y luego cierra el modal.
 */
function saveChanges() {
  // Usamos la acción para asegurar que el estado se mute correctamente.
  userStore.updateProfile(form);
  userStore.closeAllModals();
}
</script>

<template>
  <div class="bg-white rounded-lg w-full max-w-lg shadow-xl">
    
    <div class="flex justify-between items-center p-4 border-b">
      <h3 class="text-lg font-bold">Editar información personal</h3>
      <button 
        @click="userStore.closeAllModals()" 
        class="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Cerrar modal"
      >
        <LucideIcon name="x" size="24" />
      </button>
    </div>

    <div class="p-6 space-y-4">
      <BaseInput label="Nombre completo"    v-model="form.name" />
      <BaseInput label="Correo electrónico" v-model="form.email" type="email" />
      <BaseInput label="Carrera"            v-model="form.career" />
    </div>

    <div class="p-4 border-t flex justify-end gap-3">
      <button @click="userStore.closeAllModals()" class="btn">Cancelar</button>
      <button @click="saveChanges" class="btn-primary">Guardar cambios</button>
    </div>
  </div>
</template>