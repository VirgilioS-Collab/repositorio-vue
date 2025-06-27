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

const route = useRoute();
const clubStore = useClubStore();
const { details: clubDetails, loading } = storeToRefs(clubStore);
const clubId = Number(route.params.id);

// --- ESTADO LOCAL DEL FORMULARIO ---
const form = ref<any>({});
const logoPreview = ref<string | null>(null);
const showDangerModal = ref(false);
const dangerActionType = ref<'transfer' | 'archive' | 'delete' | null>(null);
const confirmationText = ref('');

// --- LÓGICA DE SINCRONIZACIÓN ---
watch(clubDetails, (newDetails) => {
  if (newDetails) {
    form.value = { ...newDetails };
    logoPreview.value = newDetails.logo_url || null;
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
    if (confirmationText.value !== clubDetails.value?.group_name) return;
    console.log(`Ejecutando acción: ${dangerActionType.value}`);
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
            <input type="text" v-model="form.group_name" class="input-focus-effect w-full" />
            <textarea v-model="form.group_description" rows="5" class="input-focus-effect w-full"></textarea>
        </div>
        <div class="md:col-span-1">
          <img :src="logoPreview || 'https://via.placeholder.com/150'" alt="Logo" class="w-32 h-32 rounded-full object-cover shadow-md mx-auto">
          <input id="file-upload" type="file" @change="handleFileChange" class="hidden" accept="image/*"/>
          <label for="file-upload" class="cursor-pointer mt-4 block text-center text-sm font-semibold text-primary hover:underline">Cambiar logo</label>
        </div>
      </div>
    </div>
    
    <div class="flex justify-end">
        <button @click="saveChanges" class="btn-primary-admin" :disabled="loading">
            <LucideIcon v-if="loading" name="loader" class="animate-spin mr-2" :size="18"/>
            Guardar Cambios
        </button>
    </div>

    <div class="p-6 rounded-xl border-2 border-dashed border-red-400 bg-red-50">
        <h3 class="text-lg font-bold text-red-800">Zona Peligrosa</h3>
        <div class="mt-4 space-y-4">
            <div class="flex justify-between items-center">
                <div><h4 class="font-semibold">Transferir Liderazgo</h4><p class="text-sm text-red-600">Asigna a otro miembro como administrador.</p></div>
                <button @click="openDangerModal('transfer')" class="btn-danger">Transferir</button>
            </div>
            <div class="flex justify-between items-center">
                <div><h4 class="font-semibold">Eliminar Club</h4><p class="text-sm text-red-600">Esta acción no se puede deshacer.</p></div>
                <button @click="openDangerModal('delete')" class="btn-danger bg-red-600 text-white hover:bg-red-700">Eliminar</button>
            </div>
        </div>
    </div>
    
    <div v-if="showDangerModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-xl font-bold text-red-800">{{ dangerDetails[dangerActionType!]?.title }}</h3>
            <p class="text-gray-600 mt-2">{{ dangerDetails[dangerActionType!]?.msg }}</p>
            <p class="mt-4 text-sm text-gray-700">Para confirmar, escribe: <strong class="text-primary">{{ clubDetails.group_name }}</strong></p>
            <input v-model="confirmationText" type="text" class="input-focus-effect w-full mt-2" />
          </div>
          <div class="bg-gray-50 p-4 flex justify-end gap-3">
            <button @click="closeDangerModal" class="btn-secondary-admin">Cancelar</button>
            <button @click="executeDangerAction" :disabled="confirmationText !== clubDetails.group_name" class="btn-danger bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300">Confirmar</button>
          </div>
      </div>
    </div>
  </div>
</template>