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
import { useClubStore } from '@/store/useClubStore'; // Importar useClubStore
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

// --- STORES Y ESTADO ---
const route = useRoute();
const memberStore = useMemberStore();
const userStore = useUserStore();
const clubStore = useClubStore(); // Definir clubStore
const { items: members, loading, filters, page, pageSize, total } = storeToRefs(memberStore);
filters.value.role = filters.value.role || 'all'; // Inicializar el filtro de rol
const clubId = computed(() => Number(route.params.id));
const showInviteModal = ref(false);
const emailsToInvite = ref('');
const selectedMembers = ref<number[]>([]);
const showChangeRoleModal = ref(false);
const newRole = ref('member');

// --- PROPIEDADES COMPUTADAS ---
const totalPages = computed(() => Math.ceil(total.value / pageSize.value));
const isAllSelected = computed(() => members.value && members.value.length > 0 && selectedMembers.value.length === members.value.length);

// --- MÉTODOS ---
function fetchMembers() { memberStore.fetchAllForAdmin(clubId.value); }

function handleInvite() {
  if (!emailsToInvite.value.trim()) {
    userStore.showToast("Por favor, ingrese al menos un correo.", 'warning');
    return;
  }
  const emailList = emailsToInvite.value.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean);
  clubStore.inviteMembers(clubId.value, { emails: emailList });
  showInviteModal.value = false;
  emailsToInvite.value = '';
}

function toggleSelectAll() {
  if (isAllSelected.value) selectedMembers.value = [];
  else selectedMembers.value = members.value.map(m => m.user_id);
}

async function applyBulkAction(action: 'activate' | 'deactivate' | 'remove' | 'changeRole') {
  if (selectedMembers.value.length === 0) {
    userStore.showToast("Seleccione al menos un miembro.", 'warning');
    return;
  }

  if (action === 'changeRole') {
    showChangeRoleModal.value = true;
    return;
  }

  try {
    for (const userId of selectedMembers.value) {
      if (action === 'activate') {
        await clubStore.updateClubMember(clubId.value, userId, { status: 'active' });
      } else if (action === 'deactivate') {
        await clubStore.updateClubMember(clubId.value, userId, { status: 'inactive' });
      } else if (action === 'remove') {
        await clubStore.removeClubMember(clubId.value, userId);
      }
    }
    userStore.showToast(`Acción "${action}" aplicada a ${selectedMembers.value.length} miembros.`, 'success');
    selectedMembers.value = [];
    fetchMembers(); // Recargar la lista de miembros para reflejar los cambios
  } catch (error: any) {
    userStore.showToast(`Error al aplicar la acción: ${error.message}`, 'error');
  }
}

async function handleChangeRole() {
  if (selectedMembers.value.length === 0 || !newRole.value) {
    userStore.showToast("Seleccione miembros y un rol.", 'warning');
    return;
  }
  try {
    for (const userId of selectedMembers.value) {
      await clubStore.updateClubMember(clubId.value, userId, { role: newRole.value });
    }
    userStore.showToast(`Rol cambiado a '${newRole.value}' para ${selectedMembers.value.length} miembros.`, 'success');
    selectedMembers.value = [];
    showChangeRoleModal.value = false;
    fetchMembers();
  } catch (error: any) {
    userStore.showToast(`Error al cambiar el rol: ${error.message}`, 'error');
  }
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
        <BaseButton @click="exportToCSV" variant="secondary">
            <template #icon><LucideIcon name="download" :size="18"/></template>
            Exportar CSV
        </BaseButton>
        <BaseButton @click="showInviteModal = true">
            <template #icon><LucideIcon name="user-plus" :size="18"/></template>
            Invitar Miembros
        </BaseButton>
      </div>
    </header>

    <div class="mb-4 p-4 bg-white rounded-lg border shadow-sm flex flex-col md:flex-row gap-3">
      <input v-model="filters.search" @input="fetchMembers" type="text" placeholder="Buscar por nombre o correo..." class="input-focus-effect flex-grow"/>
      <select v-model="filters.status" @change="fetchMembers" class="input-focus-effect">
        <option value="all">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>
      <select v-model="filters.role" @change="fetchMembers" class="input-focus-effect">
        <option value="all">Todos los roles</option>
        <option value="member">Miembro</option>
        <option value="admin">Administrador</option>
      </select>
    </div>

    <div v-if="selectedMembers.length > 0" class="mb-4 p-3 bg-primary-dark text-white rounded-lg flex items-center justify-between">
        <span class="font-semibold">{{ selectedMembers.length }} miembro(s) seleccionado(s)</span>
        <div class="flex flex-wrap items-center gap-2">
            <BaseButton @click="applyBulkAction('activate')" variant="accent">Activar</BaseButton>
            <BaseButton @click="applyBulkAction('deactivate')" variant="accent">Desactivar</BaseButton>
            <BaseButton @click="applyBulkAction('changeRole')" variant="accent">Cambiar Rol</BaseButton>
            <BaseButton @click="applyBulkAction('remove')" variant="danger">Eliminar</BaseButton>
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
             <tr v-if="!loading && (!members || members.length === 0)"><td colspan="4" class="text-center py-8 text-gray-500">No se encontraron miembros.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="flex justify-between items-center mt-4" v-if="totalPages > 1">
        <p class="text-sm text-gray-600">Página {{ page }} de {{ totalPages }}</p>
        <div class="flex gap-2">
            <BaseButton @click="page--" :disabled="page <= 1" variant="secondary">Anterior</BaseButton>
            <BaseButton @click="page++" :disabled="page >= totalPages" variant="secondary">Siguiente</BaseButton>
        </div>
    </div>

    <div v-if="showInviteModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4">Invitar Nuevos Miembros</h3>
        <p class="text-sm text-gray-500 mb-4">Ingresa los correos, separados por comas, punto y coma o saltos de línea.</p>
        <textarea v-model="emailsToInvite" rows="5" class="input-focus-effect w-full" placeholder="ejemplo@utp.ac.pa"></textarea>
        <div class="flex justify-end gap-3 mt-6">
          <BaseButton @click="showInviteModal = false" variant="secondary">Cancelar</BaseButton>
          <BaseButton @click="handleInvite">Enviar Invitaciones</BaseButton>
        </div>
      </div>
    </div>

    <div v-if="showChangeRoleModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4">Cambiar Rol de Miembros</h3>
        <p class="text-sm text-gray-500 mb-4">Selecciona el nuevo rol para los miembros seleccionados.</p>
        <select v-model="newRole" class="input-focus-effect w-full">
          <option value="member">Miembro</option>
          <option value="admin">Administrador</option>
        </select>
        <div class="flex justify-end gap-3 mt-6">
          <BaseButton @click="showChangeRoleModal = false" variant="secondary">Cancelar</BaseButton>
          <BaseButton @click="handleChangeRole">Confirmar Cambio</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>