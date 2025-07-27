<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ModalOverlay from '@/components/ui/ModalOverlay.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { useClubStore } from '@/store/useClubStore';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/useAuthStore'; // Agregar import de authStore
import { storeToRefs } from 'pinia';

const emit = defineEmits(['close']);

const clubStore = useClubStore();
const userStore = useUserStore();
const authStore = useAuthStore(); // Definir authStore
const { myClubs, clubs, loadingClubs, joiningClub } = storeToRefs(clubStore);
const { user: currentUser } = storeToRefs(authStore); // Usar 'user' en lugar de 'currentUser'

const searchQuery = ref('');
const errorMessage = ref('');

// Filtrar clubes: no mostrar los que ya son del usuario o a los que ya ha enviado solicitud
const availableClubs = computed(() => {
  if (!clubs.value) return [];
  const userClubIds = new Set(myClubs.value.map(c => c.club_id));
  // Corregir las propiedades según el tipo JoinRequestDTO actual
  const pendingRequestClubIds = new Set(
    clubStore.joinRequests.filter(req => req.user_id === currentUser.value?.user_id && req.status === 'pending')
      .map(req => req.club_id)
  );

  return clubs.value.filter(club => {
    const matchesSearch = club.g_group_name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const isNotMyClub = !userClubIds.has(club.club_id);
    const hasNoPendingRequest = !pendingRequestClubIds.has(club.club_id);
    
    return matchesSearch && isNotMyClub && hasNoPendingRequest;
  });
});

async function requestJoin(clubId: number) {
  errorMessage.value = '';
  try {
    await clubStore.requestJoinClub(clubId);
    userStore.showToast('Solicitud enviada con éxito!', 'success');
    emit('close');
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al enviar solicitud.';
    userStore.showToast(errorMessage.value, 'error');
  }
}

function close() {
  emit('close');
}

onMounted(() => {
  clubStore.fetchAllClubs();
  clubStore.fetchMyClubs(); // Asegurarse de tener los clubes del usuario
  // clubStore.fetchJoinRequests(); // Si necesitas las solicitudes pendientes aquí
});
</script>

<template>
  <ModalOverlay @close="close">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-darkText">Unirme a un Club</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <LucideIcon name="x" :size="24" />
        </button>
      </div>

      <div class="mb-4">
        <BaseInput
          id="clubSearch"
          v-model="searchQuery"
          type="text"
          placeholder="Buscar club por nombre..."
          class="w-full"
        />
      </div>

      <div v-if="loadingClubs" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p class="text-gray-500 mt-2">Cargando clubes...</p>
      </div>

      <div v-else-if="availableClubs.length > 0" class="space-y-3 max-h-60 overflow-y-auto pr-2">
        <div v-for="club in availableClubs" :key="club.club_id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div>
            <h4 class="font-semibold text-darkText">{{ club.g_group_name }}</h4>
            <p class="text-sm text-gray-500">{{ club.g_group_description }}</p>
          </div>
          <BaseButton 
            @click="requestJoin(club.club_id)"
            :loading="joiningClub"
            :disabled="joiningClub"
            size="sm"
          >
            Solicitar Unión
          </BaseButton>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <p>No hay clubes disponibles para unirte o ya has enviado una solicitud.</p>
      </div>

      <p v-if="errorMessage" class="text-red-500 text-sm mt-4">{{ errorMessage }}</p>
    </div>
  </ModalOverlay>
</template>
