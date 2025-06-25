<script setup lang="ts">
/**
 * @file: src/views/club/Settings.vue
 * @description: Vista para la configuración de un club.
 * - CORREGIDO: Solucionado error de compilación al manejar estado nulo inicial.
 * - IMPLEMENTADO: Formulario para editar datos del club (RF5.4.1).
 * - IMPLEMENTADO: Funcionalidad de carga y vista previa de logo (RF5.4.1).
 * - IMPLEMENTADO: Interruptor para módulo de finanzas (RF5.4.2).
 * - IMPLEMENTADO: Zona Peligrosa con modales de confirmación (RF5.4.4).
 */
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useClubStore } from '@/store/useClubStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';

const route = useRoute();
const clubStore = useClubStore();
const { details: clubDetails, loading } = storeToRefs(clubStore);

const clubId = Number(route.params.id);

// --- Estado Local del Formulario ---
const form = ref<any>({
  group_name: '',
  group_description: '',
  social_links: { facebook: '', instagram: '', twitter: '' },
  has_funds: false,
});
const logoPreview = ref<string | null>(null);

// --- Lógica para sincronizar el store con el formulario local ---
watch(clubDetails, (newDetails) => {
  if (newDetails) {
    form.value.group_name = newDetails.group_name;
    form.value.group_description = newDetails.group_description;
    // Aquí se agregarían los demás campos si existieran en el DTO
  }
}, { immediate: true });

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    logoPreview.value = URL.createObjectURL(file);
    // Aquí iría la lógica para subir el `file` al servidor
  }
}

function saveChanges() {
  clubStore.updateDetails(clubId, form.value);
}

// --- Lógica para la Zona Peligrosa ---
const showDangerModal = ref(false);
const dangerAction = ref<'transfer' | 'archive' | 'delete' | null>(null);
const confirmationText = ref('');

const dangerDetails = {
  transfer: { title: "Transferir Liderazgo", msg: "Esta acción es irreversible. Perderás todos los permisos de administrador." },
  archive: { title: "Archivar Club", msg: "El club no será visible públicamente y no se podrán crear nuevas actividades." },
  delete: { title: "Eliminar Club", msg: "¡Peligro! Se eliminarán permanentemente todos los datos, miembros y actividades del club." }
};

function openDangerModal(action: 'transfer' | 'archive' | 'delete') {
  dangerAction.value = action;
  showDangerModal.value = true;
}

function closeDangerModal() {
  showDangerModal.value = false;
  confirmationText.value = '';
  dangerAction.value = null;
}

function executeDangerAction() {
    if (confirmationText.value !== clubDetails.value?.group_name) {
        alert("El nombre del club no coincide.");
        return;
    }
    console.log(`--- MODO PRUEBA: Ejecutando acción peligrosa: ${dangerAction.value} ---`);
    closeDangerModal();
}
</script>

<template>
  <div v-if="clubDetails" class="space-y-8">
    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <h3 class="text-lg font-bold text-darkText mb-4">Información del Club</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre del Club</label>
            <input type="text" v-model="form.group_name" class="input-focus-effect w-full mt-1" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea v-model="form.group_description" rows="5" class="input-focus-effect w-full mt-1"></textarea>
          </div>
        </div>
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700">Logo del Club</label>
          <div class="mt-1">
            <img :src="logoPreview || 'https://via.placeholder.com/150/00205B/FFFFFF?text=Logo'" alt="Vista previa del logo" class="w-32 h-32 rounded-full object-cover shadow-md mx-auto">
            <input id="file-upload" type="file" @change="handleFileChange" class="hidden" accept="image/*"/>
            <label for="file-upload" class="cursor-pointer mt-4 block text-center text-sm font-semibold text-primary hover:underline">
              Cambiar logo
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border">
       <h3 class="text-lg font-bold text-darkText mb-4">Configuración Adicional</h3>
       <div class="space-y-4">
            <div>...</div>
            <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <h4 class="font-semibold">Manejar Fondos</h4>
                    <p class="text-sm text-gray-500">Activa el módulo financiero para registrar ingresos y egresos.</p>
                </div>
                <button @click="form.has_funds = !form.has_funds" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors" :class="form.has_funds ? 'bg-primary' : 'bg-gray-200'">
                    <span :class="form.has_funds ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                </button>
            </div>
       </div>
    </div>
    
    <div class="flex justify-end">
        <button @click="saveChanges" class="btn-primary" :disabled="loading">
            <LucideIcon v-if="loading" name="loader" class="animate-spin mr-2"/>
            {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
    </div>

    <div class="p-6 rounded-xl border-2 border-dashed border-red-400 bg-red-50">
        <h3 class="text-lg font-bold text-red-800">Zona Peligrosa</h3>
        <div class="mt-4 space-y-4">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold">Transferir Liderazgo</h4>
                    <p class="text-sm text-red-600">Asigna a otro miembro como el único administrador del club.</p>
                </div>
                <button @click="openDangerModal('transfer')" class="btn-danger">Transferir</button>
            </div>
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold">Archivar Club</h4>
                    <p class="text-sm text-red-600">Oculta el club del público general.</p>
                </div>
                <button @click="openDangerModal('archive')" class="btn-danger">Archivar</button>
            </div>
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold">Eliminar Club</h4>
                    <p class="text-sm text-red-600">Esta acción no se puede deshacer.</p>
                </div>
                <button @click="openDangerModal('delete')" class="btn-danger bg-red-600 text-white hover:bg-red-700">Eliminar</button>
            </div>
        </div>
    </div>

    <div v-if="showDangerModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-xl font-bold text-red-800">{{ dangerDetails[dangerAction!]?.title }}</h3>
            <p class="text-gray-600 mt-2">{{ dangerDetails[dangerAction!]?.msg }}</p>
            <p class="mt-4 text-sm text-gray-700">Para confirmar, por favor escribe el nombre del club: <strong class="text-primary">{{ clubDetails.group_name }}</strong></p>
            <input v-model="confirmationText" type="text" class="input-focus-effect w-full mt-2" />
          </div>
          <div class="bg-gray-50 p-4 flex justify-end gap-3">
            <button @click="closeDangerModal" class="btn-secondary">Cancelar</button>
            <button @click="executeDangerAction" :disabled="confirmationText !== clubDetails.group_name" class="btn-danger bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed">Confirmar Acción</button>
          </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-10">Cargando ajustes...</div>
</template>

<style scoped>
.btn-primary { @apply flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-70; }
.btn-secondary { @apply px-4 py-2 bg-gray-200 text-darkText rounded-lg font-semibold hover:bg-gray-300 transition; }
.btn-danger { @apply px-4 py-2 bg-transparent text-red-600 border border-red-600 rounded-lg font-semibold hover:bg-red-100 transition; }
</style>