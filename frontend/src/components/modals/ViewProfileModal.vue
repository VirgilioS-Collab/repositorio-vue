<script setup lang="ts">
/**
 * @file src/components/modals/ViewProfileModal.vue
 * @description Modal para editar la información del usuario.
 * - MODIFICADO: Ahora incluye todos los campos editables del perfil
 * (nombre, email, teléfono, etc.) gracias a la actualización de los
 * modelos DTO.
 * - AÑADIDO: Componente para cambiar foto de perfil con IMGUR
 */
import { reactive } from 'vue';
import { useUserStore } from '@/store/useUserStore';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload.vue';

const userStore = useUserStore();

// El formulario ahora puede incluir todos los campos de forma segura
// porque están definidos en UserDTO.
const form = reactive({
  name: userStore.user?.name || '',
  last_name: userStore.user?.last_name || '', // Es bueno poder editar ambos
  email: userStore.user?.email || '',
  phone: userStore.user?.phone || '',
  about_me: userStore.user?.about_me || '',
  career: userStore.user?.career || '',
});

function saveChanges() {
  userStore.updateProfile(form); // La acción del store recibe el objeto completo
  userStore.closeAllModals();
}
</script>

<template>
  <div class="bg-white rounded-lg w-full max-w-lg shadow-xl">
    
    <div class="flex justify-between items-center p-4 border-b">
      <h3 class="text-lg font-bold text-gray-800">Editar Información Personal</h3>
      <button @click="userStore.closeAllModals()" class="text-gray-500 hover:text-gray-700">
        <LucideIcon name="x" :size="24" />
      </button>
    </div>

    <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
      <!-- Sección de foto de perfil -->
      <div class="flex justify-center mb-6">
        <ProfilePictureUpload 
          :current-image-url="userStore.user?.profile_photo_url"
          size="large"
        />
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <BaseInput label="Nombre(s)" v-model="form.name" />
        <BaseInput label="Apellido(s)" v-model="form.last_name" />
      </div>
      <BaseInput label="Correo electrónico" v-model="form.email" type="email" />
      <BaseInput label="Carrera" v-model="form.career" />
      <BaseInput label="Teléfono" v-model="form.phone" />
      <div>
        <label for="about_me" class="block text-sm font-medium text-gray-700">Acerca de mí</label>
        <textarea 
          id="about_me"
          v-model="form.about_me"
          rows="3"
          maxlength="200"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 resize-none"
        ></textarea>
        <p class="text-xs text-right text-gray-500 mt-1">
          {{ form.about_me.length }} / 200
        </p>
      </div>
    </div>

    <div class="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
      <button @click="userStore.closeAllModals()" class="btn">Cancelar</button>
      <button @click="saveChanges" class="btn-primary">Guardar Cambios</button>
    </div>
  </div>
</template>