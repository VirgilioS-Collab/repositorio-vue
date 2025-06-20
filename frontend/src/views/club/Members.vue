<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useMemberStore } from "@/store/useMemberStore";
import LucideIcon from "@/components/ui/LucideIcon.vue";

const memberStore = useMemberStore();
const route = useRoute();
const clubId = Number(route.params.id);
const search = ref("");
const stateFilter = ref("Todos los estados");
const roleFilter = ref("Todos los roles");
const showInviteModal = ref(false);
const inviteEmails = ref("");

onMounted(() => memberStore.fetchAll(clubId));

const filtered = computed(() => {
  let arr = memberStore.items;
  // Lógica de filtros
  return arr;
});

function inviteMembers() {
  const emails = inviteEmails.value.split(",").map((e) => e.trim());
  memberStore.inviteMany(clubId, emails);
  showInviteModal.value = false;
  inviteEmails.value = "";
}
</script>

<template>
  <header class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Miembros</h1>
    <button
      @click="showInviteModal = true"
      class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    >
      <LucideIcon name="mail" class="inline-block mr-2" />
      Invitar Miembros
    </button>
  </header>
  <div class="mb-4">
    <input
      v-model="search"
      placeholder="Buscar miembro..."
      class="border p-2 rounded-md w-full"
    />
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">Nombre</th>
          <th class="py-2 px-4 border-b">Rol</th>
          <th class="py-2 px-4 border-b">Estado</th>
          <th class="py-2 px-4 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in filtered" :key="m.user_id">
          <td class="py-2 px-4 border-b">{{ m.user_id }}</td>
          <td class="py-2 px-4 border-b">{{ m.role_id }}</td>
          <td class="py-2 px-4 border-b">{{ m.status_id }}</td>
          <td class="py-2 px-4 border-b">
            <button
              @click="memberStore.remove(clubId, m.user_id)"
              class="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="showInviteModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg">
      <h2 class="text-xl font-bold mb-4">Invitar Nuevos Miembros</h2>
      <textarea
        v-model="inviteEmails"
        placeholder="Introduce los correos separados por comas"
        class="border p-2 rounded-md w-full mb-4"
      ></textarea>
      <div class="flex justify-end gap-4">
        <button
          @click="showInviteModal = false"
          class="bg-gray-300 px-4 py-2 rounded-md"
        >
          Cancelar
        </button>
        <button
          @click="inviteMembers"
          class="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Enviar Invitaciones
        </button>
      </div>
    </div>
  </div>
</template>