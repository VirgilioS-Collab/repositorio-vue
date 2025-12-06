<script setup lang="ts">
/**
 * @file src/views/ActivityDetailView.vue
 * @description Muestra el detalle completo de una actividad específica.
 */
import { onMounted, ref } from 'vue';
import { useActivityStore } from '@/store/useActivityStore';
import { useUserStore } from '@/store/useUserStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import ToastNotification from '@/components/ui/ToastNotification.vue';

const props = defineProps<{ id: string }>();

const activityStore = useActivityStore();
const userStore = useUserStore();

const { selectedActivity: activity, loading } = storeToRefs(activityStore);
const { toast } = storeToRefs(userStore);

const isJoining = ref(false);

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

  return `FECHA: ${capMonth} ${day}, ${year}  ${formatTime(startDate)} - ${formatTime(endDate)}`;
};

onMounted(() => {
  activityStore.fetchActivityDetails(Number(props.id));
});

async function joinActivity() {
  try {
    isJoining.value = true;

    await activityStore.joinActivity(Number(props.id));
    userStore.showToast('Te has inscrito a la actividad exitosamente.', 'success');
    activityStore.fetchActivityDetails(Number(props.id));


  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || err?.message || 'Error al inscribirse a la actividad.';
    userStore.showToast(errorMsg, 'error');

  } finally {
    isJoining.value = false;
  }
}
</script>

<template>
  <div v-if="activity && !loading" class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">

    <header class="pb-6 border-b-2 border-accent">
      <p class="font-semibold text-accent mb-1">{{ activity.group_name }} presenta:</p>
      <h1 class="text-4xl font-extrabold text-darkText tracking-tight">{{ activity.activity_name }}</h1>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
      <div class="md:col-span-2">
        <h2 class="font-bold text-xl mb-3">Descripción del Evento</h2>
        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
          {{ activity.activity_description || 'El organizador no ha proporcionado una descripción detallada para esta actividad.' }}
        </p>

        <div class="bg-card border border-gray-200 p-4 rounded-xl space-y-4 mt-6">
          <div class="flex items-start gap-3">
            <LucideIcon name="calendar-days" :size="20" class="text-accent mt-1 shrink-0"/>
            <h4 class="font-semibold pr-6">Fecha y Hora</h4>
            <p class="text-sm text-gray-600 pt-0.5">{{ formatActivityDateRange(activity.activity_datetime) }}</p>
          </div>

          <div class="flex items-start gap-3">
            <LucideIcon name="map-pin" :size="20" class="text-accent mt-1 shrink-0"/>
            <h4 class="font-semibold pr-11">Ubicación</h4>
            <p class="text-sm text-gray-600 pt-0.5">{{ activity.location || 'Online' }}</p>
          </div>

          <div class="flex items-start gap-3">
            <LucideIcon name="users-2" :size="20" class="text-accent mt-1 shrink-0"/>
            <h4 class="font-semibold pr-10">Capacidad</h4>
            <p class="text-sm text-gray-600 pt-0.5"> {{ activity.participants_count }} / {{ activity.max_participants }}</p>
          </div>
        </div>
      </div>

      <div class="md:col-span-1 space-y-6">
        <button
          @click="joinActivity"
          :disabled="isJoining"
          class="w-full py-3 text-lg font-bold text-white bg-primary rounded-lg hover:bg-primary-dark transition shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60"
        >
          {{ isJoining ? 'Inscribiendo...' : 'Inscribirse' }}
        </button>
      </div>
    </div>
  </div>

  <div v-else class="text-center p-16">
    Cargando detalles de la actividad...
  </div>

  <ToastNotification v-if="toast.show" :message="toast.message" :type="toast.type" />
</template>
