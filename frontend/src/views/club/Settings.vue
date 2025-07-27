<script setup lang="ts">
/**
 * @file: src/views/club/Settings.vue
 * @description: Vista para la configuración de un club.
 * - INTEGRA: El diseño de UI completo con la lógica de stores y modales.
 */
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useClubStore } from '@/store/useClubStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import type { ClubSettingsDTO } from '@/services/dao/models/Admin';
import type { ClubUpdateRequestDTO } from '@/services/dao/models/Club';

const route = useRoute();
const clubStore = useClubStore();
const { details: clubDetails, loading } = storeToRefs(clubStore);
const clubId = Number(route.params.id);

// --- ESTADO LOCAL DEL FORMULARIO ---
const form = ref<ClubSettingsDTO>({});
const logoPreview = ref<string | null>(null);
const showDangerModal = ref(false);
const dangerActionType = ref<'transfer' | 'archive' | 'delete' | null>(null);
const confirmationText = ref('');

// --- LÓGICA DE SINCRONIZACIÓN ---
watch(clubDetails, (newDetails) => {
  if (newDetails) {
    form.value = {
      name: newDetails.g_group_name,
      description: newDetails.g_group_description,
      logo_url: newDetails.image_url,
      social_links: newDetails.contact_info?.social_media || {},
      has_funds: newDetails.has_funds ?? false,
    };
    logoPreview.value = newDetails.image_url || null;
  }
}, { immediate: true });

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) logoPreview.value = URL.createObjectURL(file);
}

function saveChanges() { clubStore.updateSettings(clubId, form.value); }

// --- LÓGICA PARA ZONA PELIGROSA ---
const dangerDetails = {
  transfer: { title: "Transferir Liderazgo", msg: "Esta acción es irreversible." },
  archive: { title: "Archivar Club", msg: "El club no será visible públicamente." },
  delete: { title: "Eliminar Club", msg: "¡Peligro! Se eliminarán todos los datos." }
};
function openDangerModal(action: 'transfer' | 'archive' | 'delete') {
  dangerActionType.value = action;
  showDangerModal.value = true;
}
function closeDangerModal() {
  showDangerModal.value = false;
  confirmationText.value = '';
  dangerActionType.value = null;
}
function executeDangerAction() {
    if (confirmationText.value !== clubDetails.value?.g_group_name) return;
    console.log(`Ejecutando acción: ${dangerActionType.value}`);
    // Aquí se debería llamar a la acción del store correspondiente
    if (dangerActionType.value === 'transfer') {
      // clubStore.transferLeadership(clubId, newLeaderId);
    } else if (dangerActionType.value === 'archive') {
      // clubStore.archiveClub(clubId);
    } else if (dangerActionType.value === 'delete') {
      // clubStore.deleteClub(clubId);
    }
    closeDangerModal();
}

// --- CICLO DE VIDA ---
onMounted(() => { clubStore.fetchDetails(clubId); });
</script>

<template>
  <div v-if="clubDetails" class="space-y-8">
    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <h3 class="text-lg font-bold text-darkText mb-4">Información del Club</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-4">
            <input type="text" v-model="form.name" class="input-focus-effect w-full" />
            <textarea v-model="form.description" rows="5" class="input-focus-effect w-full"></textarea>
            
            <h4 class="font-semibold text-darkText mt-4 mb-2">Redes Sociales y Contacto</h4>
            <div v-if="form.social_links">
              <input type="text" v-model="form.social_links.facebook" placeholder="Enlace de Facebook" class="input-focus-effect w-full" />
              <input type="text" v-model="form.social_links.instagram" placeholder="Enlace de Instagram" class="input-focus-effect w-full" />
              <input type="text" v-model="form.social_links.twitter" placeholder="Enlace de Twitter" class="input-focus-effect w-full" />
              <input type="text" v-model="form.social_links.website" placeholder="Enlace de Sitio Web" class="input-focus-effect w-full" />
            </div>
        </div>
        <div class="md:col-span-1">
          <img :src="logoPreview || 'https://via.placeholder.com/150'" alt="Logo" class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-md mx-auto">
          <input id="file-upload" type="file" @change="handleFileChange" class="hidden" accept="image/*"/>
          <label for="file-upload" class="cursor-pointer mt-4 block text-center text-sm font-semibold text-primary hover:underline">Cambiar logo</label>
        </div>
      </div>
      <div class="mt-6 flex items-center justify-between">
        <label for="has-funds" class="flex items-center cursor-pointer">
          <span class="text-sm font-medium text-gray-700 mr-3">Maneja Fondos</span>
          <div class="relative">
            <input type="checkbox" id="has-funds" class="sr-only" v-model="form.has_funds">
            <div class="block bg-gray-200 w-10 h-6 rounded-full"></div>
            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
          </div>
        </label>
      </div>
    </div>
    
    <div class="flex justify-end">
        <BaseButton @click="saveChanges" :loading="loading" :disabled="loading">
            Guardar Cambios
        </BaseButton>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <h3 class="text-lg font-bold text-darkText mb-4">Permisos del Club</h3>
      <p class="text-gray-600">Aquí se gestionarán los roles y accesos de los miembros del club por módulo.</p>
      <!-- TODO: Implementar la matriz de chequeo de permisos (RF5.4.3) -->
      <div class="mt-4 p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
        <p>Sección de Permisos en construcción.</p>
        <p>Aquí irá la matriz de chequeo para asignar roles y accesos.</p>
      </div>
    </div>

    <div class="p-6 rounded-xl border-2 border-dashed border-red-400 bg-red-50">
        <h3 class="text-lg font-bold text-red-800">Zona Peligrosa</h3>
        <div class="mt-4 space-y-4">
            <div class="flex justify-between items-center">
                <div><h4 class="font-semibold">Transferir Liderazgo</h4><p class="text-sm text-red-600">Asigna a otro miembro como administrador.</p></div>
                <BaseButton @click="openDangerModal('transfer')" variant="danger">Transferir</BaseButton>
            </div>
            <div class="flex justify-between items-center">
                <div><h4 class="font-semibold">Archivar Club</h4><p class="text-sm text-red-600">El club no será visible públicamente.</p></div>
                <BaseButton @click="openDangerModal('archive')" variant="danger">Archivar</BaseButton>
            </div>
            <div class="flex justify-between items-center">
                <div><h4 class="font-semibold">Eliminar Club</h4><p class="text-sm text-red-600">Esta acción no se puede deshacer.</p></div>
                <BaseButton @click="openDangerModal('delete')" variant="danger">Eliminar</BaseButton>
            </div>
        </div>
    </div>
    
    <div v-if="showDangerModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-xl font-bold text-red-800">{{ dangerDetails[dangerActionType!]?.title }}</h3>
            <p class="text-gray-600 mt-2">{{ dangerDetails[dangerActionType!]?.msg }}</p>
            <p class="mt-4 text-sm text-gray-700">Para confirmar, escribe: <strong class="text-primary">{{ clubDetails?.g_group_name }}</strong></p>
            <input v-model="confirmationText" type="text" class="input-focus-effect w-full mt-2" />
          </div>
          <div class="bg-gray-50 p-4 flex justify-end gap-3">
            <BaseButton @click="closeDangerModal" variant="secondary">Cancelar</BaseButton>
            <BaseButton @click="executeDangerAction" :disabled="confirmationText !== clubDetails?.g_group_name" variant="danger">Confirmar</BaseButton>
          </div>
      </div>
    </div>
  </div>
</template>