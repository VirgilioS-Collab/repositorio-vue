<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute }   from 'vue-router'
import { useClubStore } from '@/store/useClubStore'
import LucideIcon from '@/components/ui/LucideIcon.vue'

const clubStore = useClubStore()
const route     = useRoute()
const id        = Number(route.params.id)
const logoFile = ref<File | null>(null);

onMounted(() => {
  clubStore.fetchDetails(id)
})

function saveDetails() {
  clubStore.updateDetails(id, clubStore.details)
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    logoFile.value = target.files[0];
  }
}

function uploadLogo() {
  if (logoFile.value) {
    // Lógica para subir el logo
    console.log("Subiendo logo:", logoFile.value);
  }
}

function transferLeadership() {
  if (confirm("¿Estás seguro de que quieres transferir el liderazgo de este club?")) {
    // Lógica para transferir liderazgo
  }
}

function archiveClub() {
  if (confirm("¿Estás seguro de que quieres archivar este club?")) {
    // Lógica para archivar el club
  }
}

function deleteClub() {
  if (confirm("Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este club?")) {
    // Lógica para eliminar el club
  }
}
</script>

<template>
  <header class="mb-6">
    <h1 class="text-2xl font-bold">Ajustes del Club</h1>
  </header>

  <div class="bg-white p-6 rounded-lg shadow-sm border mb-8">
    <h2 class="text-xl font-semibold mb-4">Información General</h2>
    <div class="space-y-4">
      <input v-model="clubStore.details.name" placeholder="Nombre del club" class="border p-2 rounded-md w-full" />
      <textarea v-model="clubStore.details.description" placeholder="Descripción del club" class="border p-2 rounded-md w-full"></textarea>
      <div>
        <label class="block text-sm font-medium text-gray-700">Logo del Club</label>
        <input type="file" @change="onFileChange" accept="image/*" class="mt-1"/>
        <button @click="uploadLogo" class="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Subir Logo</button>
      </div>
      <button @click="saveDetails" class="bg-green-500 text-white px-4 py-2 rounded-md">Guardar cambios</button>
    </div>
  </div>

  <div class="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
      <h2 class="text-xl font-semibold mb-4 text-red-800">Zona Peligrosa</h2>
      <div class="space-y-4">
        <button @click="transferLeadership" class="w-full text-left bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Transferir Liderazgo
        </button>
        <button @click="archiveClub" class="w-full text-left bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
            Archivar Club
        </button>
        <button @click="deleteClub" class="w-full text-left bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800">
            Eliminar Club
        </button>
      </div>
  </div>
</template>
