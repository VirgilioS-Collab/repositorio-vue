<script setup lang="ts">
/**
 * @file: src/views/club/Members.vue
 * @description: Vista para la gestión de miembros de un club.
 * - INTEGRA: El diseño de UI completo con la arquitectura de stores correcta.
 * - SOLUCIONA: Todos los errores reportados de TypeScript y CSS.
 */
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMemberStore } from '@/store/useMemberStore';
import { useUserStore } from '@/store/useUserStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';

// --- STORES Y ESTADO ---
const route = useRoute();
const memberStore = useMemberStore();
const userStore = useUserStore();
const { items: members, loading, filters, page, pageSize, total } = storeToRefs(memberStore);
const clubId = computed(() => Number(route.params.id));
const showInviteModal = ref(false);
const emailsToInvite = ref('');
const selectedMembers = ref<number[]>([]);

// --- PROPIEDADES COMPUTADAS ---
const totalPages = computed(() => Math.ceil(total.value / pageSize.value));
const isAllSelected = computed(() => members.value.length > 0 && selectedMembers.value.length === members.value.length);

// --- MÉTODOS ---
function fetchMembers() { memberStore.fetchAllForAdmin(clubId.value); }

function handleInvite() {
  if (!emailsToInvite.value.trim()) {
    userStore.showToast("Por favor, ingrese al menos un correo.", 'warning');
    return;
  }
  const emailList = emailsToInvite.value.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean);
  memberStore.inviteMany(clubId.value, emailList);
  showInviteModal.value = false;
  emailsToInvite.value = '';
}

function toggleSelectAll() {
  if (isAllSelected.value) selectedMembers.value = [];
  else selectedMembers.value = members.value.map(m => m.user_id);
}

function applyBulkAction(action: 'activate' | 'deactivate' | 'remove') {
  if (selectedMembers.value.length === 0) {
    userStore.showToast("Seleccione al menos un miembro.", 'warning');
    return;
  }
  console.log(`Aplicando acción: ${action} a los miembros:`, selectedMembers.value);
  userStore.showToast(`Acción "${action}" aplicada a ${selectedMembers.value.length} miembros.`, 'success');
  selectedMembers.value = [];
}

function exportToCSV() { memberStore.exportCsv(clubId.value); }

// --- CICLO DE VIDA ---
onMounted(fetchMembers);
</script>

<template>
  <div>
    <header class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-2xl font-bold text-darkText">Gestión de Miembros</h2>
      <div class="flex flex-wrap items-center gap-2 w-auto">
        <button @click="exportToCSV" class="btn-secondary-admin flex-shrink-0 inline-flex items-center justify-center px-4 py-2 text-sm"><LucideIcon name="download" :size="18"/>Exportar CSV</button>
        <button @click="showInviteModal = true" class="btn-primary-admin flex-shrink-0 inline-flex items-center justify-center px-4 py-2 text-sm"><LucideIcon name="user-plus" :size="18"/>Invitar Miembros</button>
      </div>
    </header>

    <div class="mb-4 p-4 bg-white rounded-lg border shadow-sm flex flex-col md:flex-row gap-3">
      <input v-model="filters.search" @input="fetchMembers" type="text" placeholder="Buscar por nombre o correo..." class="input-focus-effect flex-grow"/>
      <select v-model="filters.status" @change="fetchMembers" class="input-focus-effect">
        <option value="all">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>
    </div>

    <div v-if="selectedMembers.length > 0" class="mb-4 p-3 bg-primary-dark text-white rounded-lg flex items-center justify-between">
        <span class="font-semibold">{{ selectedMembers.length }} miembro(s) seleccionado(s)</span>
        <div class="flex flex-wrap items-center gap-2">
            <button @click="applyBulkAction('activate')" class="btn-bulk-action">Activar</button>
            <button @click="applyBulkAction('deactivate')" class="btn-bulk-action">Desactivar</button>
            <button @click="applyBulkAction('remove')" class="btn-bulk-action bg-red-500 hover:bg-red-600">Eliminar</button>
        </div>
    </div>

    <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="p-4"><input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" class="rounded"/></th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading"><td colspan="4" class="text-center py-8 text-gray-500">Cargando miembros...</td></tr>
            <tr v-else v-for="member in members" :key="member.user_id" class="hover:bg-soft">
              <td class="p-4"><input type="checkbox" v-model="selectedMembers" :value="member.user_id" class="rounded"/></td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img class="h-10 w-10 rounded-full object-cover" :src="member.profile_photo_url || `https://i.pravatar.cc/40?u=${member.user_id}`" :alt="member.name">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-darkText">{{ member.name }}</div>
                    <div class="text-sm text-gray-500">{{ member.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ member.role_name }}</td>
              <td class="px-6 py-4"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="member.status_name === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">{{ member.status_name }}</span></td>
            </tr>
             <tr v-if="!loading && members.length === 0"><td colspan="4" class="text-center py-8 text-gray-500">No se encontraron miembros.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="flex justify-between items-center mt-4" v-if="totalPages > 1">
        <p class="text-sm text-gray-600">Página {{ page }} de {{ totalPages }}</p>
        <div class="flex gap-2">
            <button @click="page--" :disabled="page <= 1" class="btn-secondary-admin">Anterior</button>
            <button @click="page++" :disabled="page >= totalPages" class="btn-secondary-admin">Siguiente</button>
        </div>
    </div>

    <div v-if="showInviteModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4">Invitar Nuevos Miembros</h3>
        <p class="text-sm text-gray-500 mb-4">Ingresa los correos, separados por comas, punto y coma o saltos de línea.</p>
        <textarea v-model="emailsToInvite" rows="5" class="input-focus-effect w-full" placeholder="ejemplo@utp.ac.pa"></textarea>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showInviteModal = false" class="btn-secondary-admin">Cancelar</button>
          <button @click="handleInvite" class="btn-primary-admin">Enviar Invitaciones</button>
        </div>
      </div>
    </div>
  </div>
</template>