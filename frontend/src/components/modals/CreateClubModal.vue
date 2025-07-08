<script setup lang="ts">
import { ref, defineEmits, computed } from 'vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import ModalOverlay from '@/components/ui/ModalOverlay.vue';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload.vue'; // Importar el componente de subida de imagen
import { useClubStore } from '@/store/useClubStore';
import ImageDao from '@/services/dao/ImageDao'; // Importar ImageDao
import type { ClubCreateRequestDTO } from '@/services/dao/models/Club';

const emit = defineEmits(['close', 'clubCreated']);

const clubStore = useClubStore();

const form = ref<ClubCreateRequestDTO>({
  g_group_name: '',
  g_group_description: '',
  g_group_category: 'academic', // Default type
  max_members: 100, // Default max members
  image_url: '', // Placeholder for image URL
});

const isLoading = ref(false);
const errorMessage = ref('');
const clubLogoFile = ref<File | null>(null); // Nuevo ref para el archivo de imagen

const maxMembersComputed = computed({
  get: () => form.value.max_members !== undefined ? String(form.value.max_members) : '',
  set: (val) => { form.value.max_members = val === '' ? undefined : Number(val); }
});

function handleLogoSelected(file: File) {
  clubLogoFile.value = file;
}

async function createClub() {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    // Lógica para subir la imagen primero si hay un archivo seleccionado
    if (clubLogoFile.value) {
      const response = await ImageDao.uploadGenericImage(clubLogoFile.value);
      form.value.image_url = response.imageUrl;
    }

    await clubStore.createClub(form.value);
    emit('clubCreated');
    emit('close');
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al crear el club.';
  } finally {
    isLoading.value = false;
  }
}

function close() {
  emit('close');
}
</script>

<template>
  <ModalOverlay @close="close">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-darkText">Crear Nuevo Club</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <LucideIcon name="x" :size="24" />
        </button>
      </div>

      <form @submit.prevent="createClub" class="space-y-4">
        <BaseInput
          id="clubName"
          label="Nombre del Club"
          v-model="form.g_group_name"
          type="text"
          placeholder="Ej. Club de Lectura"
          required
        />
        <BaseInput
          id="clubDescription"
          label="Descripción"
          v-model="form.g_group_description"
          type="textarea"
          placeholder="Describe brevemente el propósito del club..."
          required
        />
        <BaseInput
          id="clubType"
          label="Tipo de Club"
          v-model="form.g_group_category"
          type="select"
          :options="[{ value: 'academic', label: 'Académico' }, { value: 'sport', label: 'Deportivo' }, { value: 'cultural', label: 'Cultural' }, { value: 'social', label: 'Social' }]"
          required
        />
        <BaseInput
          id="maxMembers"
          label="Máximo de Miembros"
          v-model="maxMembersComputed"
          type="number"
          min="1"
          required
        />
        
        <!-- Componente de subida de imagen -->
        <div class="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-md">
          <h4 class="text-md font-semibold text-gray-700 mb-2">Logo del Club</h4>
          <ProfilePictureUpload 
            :current-image-url="form.image_url"
            @file-selected="handleLogoSelected"
            size="large"
            :show-upload-button="true"
          />
          <p class="text-sm text-gray-500 mt-2">Haz clic en el icono de la cámara para subir un logo.</p>
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="close" class="btn-secondary-admin">Cancelar</button>
          <button type="submit" class="btn-primary-admin" :disabled="isLoading">
            <LucideIcon v-if="isLoading" name="loader" class="animate-spin mr-2" :size="18" />
            Crear Club
          </button>
        </div>
      </form>
    </div>
  </ModalOverlay>
</template>

<style scoped>
/* Estilos específicos si son necesarios */
</style>