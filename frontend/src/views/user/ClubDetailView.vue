<script setup lang="ts">
/**
 * @file src/views/ClubDetailView.vue
 * @description Muestra el perfil completo de un club, incluyendo su
 * información, miembros y actividades.
 */
import { onMounted, computed } from 'vue';
import { useClubStore } from '@/store/useClubStore';
import { useMemberStore } from '@/store/useMemberStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useUserStore } from '@/store/useUserStore';
import { storeToRefs } from 'pinia';
import type { ClubMemberDTO, ClubDTO } from '@/services/dao/models/Club';
import type { MemberDTO } from '@/services/dao/models/Member';

import LucideIcon from '@/components/ui/LucideIcon.vue';
import ToastNotification from '@/components/ui/ToastNotification.vue';

import { useRouter } from 'vue-router';

const props = defineProps<{ id: string }>();
const router = useRouter();

const clubStore = useClubStore();
const memberStore = useMemberStore();
const activityStore = useActivityStore();
const userStore = useUserStore();

// Hacemos el estado reactivo para la UI
const { details: club, loading: clubLoading, joiningClub, leavingClub } = storeToRefs(clubStore);
const { items: members, loading: membersLoading } = storeToRefs(memberStore);
const { activities, loading: activitiesLoading } = storeToRefs(activityStore);
const { toast } = storeToRefs(userStore);

// Al montar el componente, buscamos toda la información necesaria
onMounted(() => {

  clubStore.fetchDetails(Number(props.id));
  activityStore.fetchByClub(Number(props.id));
});

// Formatea la fecha de creación al formato "Mes Day, Year" en español (ej. "Julio 13, 2025")
const formattedCreationDate = computed(() => {
  const raw = club.value?.creation_date ?? club.value?.created_date;
  if (!raw) return 'No disponible';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return 'No disponible';
  const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  const capMonth = month.charAt(0).toUpperCase() + month.slice(1);
  return `${capMonth} ${date.getDate()}, ${date.getFullYear()}`;
});

// Formatea el rango de fechas de una actividad (ej. "FECHA: Noviembre 15, 2025 HORARIO: 07:00PM A 10:00PM")
const formatActivityDateRange = (activityDatetime: any) => {
  if (!activityDatetime || !Array.isArray(activityDatetime) || activityDatetime.length === 0) {
    return 'Fecha no disponible';
  }
  const schedule = activityDatetime[0];
  const startDate = new Date(schedule.start_date);
  const endDate = new Date(schedule.end_date);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 'Fecha no disponible';
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return `${String(displayHours).padStart(2, '0')}:${minutes}${ampm}`;
  };

  const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(startDate);
  const capMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const day = startDate.getDate();
  const year = startDate.getFullYear();

  return `FECHA: ${capMonth} ${day}, ${year} HORA: ${formatTime(startDate)} - ${formatTime(endDate)}`;
};

// Acción al hacer click en 'Unirse al Club'
async function joinClub() {
  try {
    await clubStore.joinClub(Number(props.id));
    userStore.showToast('Te has unido al club exitosamente.', 'success');
    await clubStore.fetchDetails(Number(props.id));
  } catch (err: any) {
    console.error('Error al solicitar unión:', err);
    const errorMsg = err?.response?.data?.message || err?.message || 'Error al solicitar unirse al club.';
    userStore.showToast(errorMsg, 'error');
  }
}

async function leaveClub() {
  try {
    await clubStore.leaveClub(Number(props.id));
    userStore.showToast('Te has salido del club exitosamente.', 'success');
    await clubStore.fetchDetails(Number(props.id));
  } catch (err: any) {
    console.error('Error al solicitar unión:', err);
    const errorMsg = err?.response?.data?.message || err?.message || 'Error al intentar salirse al club.';
    userStore.showToast(errorMsg, 'error');
  }
}

// Navega al detalle de la actividad
function goToActivityDetail(activityId: number) {
  router.push({ name: 'ActivityDetail', params: { id: activityId } });
}
</script>

<template>
  <div v-if="club && !clubLoading" class="p-4 sm:p-6 lg:p-8">
    <header class="mb-8">
      <div class="h-40 bg-blue-200 rounded-xl flex items-center justify-center bg-cover bg-center"> 
        </div>
      <div class="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:ml-8 gap-4">
        <div class="w-24 h-24 bg-accent rounded-full border-4 border-white flex items-center justify-center shrink-0">
          <LucideIcon name="users" :size="36" class="text-primary"/>
        </div>
        <div class="flex-grow text-center sm:text-left">
          <h1 class="text-3xl font-bold text-darkText">{{ club.group_name }}</h1>
          <p class="text-gray-500">Club de la comunidad Alianza UTP</p>
        </div>
        <button
          @click="joinClub"
          :disabled="joiningClub"
          class="px-6 py-2 text-white font-semibold bg-primary rounded-lg hover:bg-primary-dark transition shrink-0 disabled:opacity-60"
        >
          {{ joiningClub ? 'Uniéndose...' : 'Unirse al Club' }}
        </button>
        <button
          @click="leaveClub"
          :disabled="leavingClub"
          class="px-6 py-2 text-white font-semibold bg-primary rounded-lg hover:bg-primary-dark transition shrink-0 disabled:opacity-60"
        >
          {{ leavingClub ? 'Saliendose...' : 'Salirse del Club' }}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-card border border-gray-200 p-6 rounded-xl">
          <h2 class="font-bold text-xl mb-3">Acerca de este club</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ club.group_description || 'No hay descripción disponible.' }}</p>
        </div>
        <div class="bg-card border border-gray-200 p-6 rounded-xl">
          <h2 class="font-bold text-xl mb-4">Próximas Actividades del Club</h2>
          <div v-if="activities.length > 0" class="space-y-3">
            <div
              v-for="act in activities"
              :key="act.activity_id"
              class="p-3 rounded-md hover:bg-gray-50 flex justify-between items-center cursor-pointer"
              @click="goToActivityDetail(act.activity_id)"
            >
              <div>
                <p class="font-semibold">{{ act.activity_name || act.ga_activity_name }}</p>
                <p class="text-sm text-gray-500">{{ formatActivityDateRange(act.activity_datetime) }}</p>
              </div>
              <LucideIcon name="chevron-right" class="text-gray-400"/>
            </div>
          </div>
          <p v-else class="text-gray-500">Este club no tiene actividades próximas.</p>
        </div>
      </div>
      <div class="lg:col-span-1 space-y-8">
        <div class="bg-card border border-gray-200 p-5 rounded-xl">
          <h3 class="font-bold text-lg mb-3">Cantidad de miembros: {{ club.members_count }}</h3>
        </div>
        <div class="bg-card border border-gray-200 p-5 rounded-xl space-y-3 text-sm">
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Propietario:</span><span>{{ club.owner_name || 'No disponible' }}</span></div>
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Categoría:</span><span>{{ club.group_type_name || 'No disponible' }}</span></div>
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Creado en:</span><span>{{ formattedCreationDate }}</span></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-16">Cargando detalles del club...</div>
  <ToastNotification v-if="toast.show" :message="toast.message" :type="toast.type" />
</template>