<script setup lang="ts">
/**
 * @file src/components/ActivitiesSection.vue
 * @description Muestra una vista previa de las actividades del usuario.
 * Consume el endpoint GET /api/user/me/activities
 */
import { RouterLink, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import ActivityDao from '@/services/dao/ActivityDao';
import LucideIcon from '@/components/ui/LucideIcon.vue';

type ActivityBackend = {
  activity_datetime?: string;
  activity_description?: string;
  activity_id: number;
  activity_location?: string;
  activity_name?: string;
  activity_status?: string;
  activity_type?: string;
  creator_name?: string;
  group_id?: number;
  max_participant?: number;
  participants?: number;
};

const activities = ref<ActivityBackend[]>([]);
const loading = ref(false);
const router = useRouter();

async function loadMyActivities() {
  loading.value = true;
  try {
    // Llamada al DAO (puede devolver array o { activities_list: [...] })
    const resp = await (ActivityDao.getMyActivities() as unknown);

    // Normalizar la estructura de la respuesta
    if (Array.isArray(resp)) {
      activities.value = resp as ActivityBackend[];
    } else if (resp && typeof resp === 'object' && Array.isArray((resp as any).activities_list)) {
      activities.value = (resp as any).activities_list as ActivityBackend[];
    } else if ((resp as any).data && Array.isArray((resp as any).data.activities_list)) {
      // en caso de que ActivityDao devuelva { data: { activities_list: [...] } }
      activities.value = (resp as any).data.activities_list as ActivityBackend[];
    } else {
      // fallback por si la forma es inesperada
      console.warn('Formato inesperado de getMyActivities():', resp);
      activities.value = [];
    }

  } catch (error) {
    console.error('Error loading my activities:', error);
    activities.value = [];
  } finally {
    loading.value = false;
  }
}

function goToActivityList() {
  router.push({ name: 'ActivityList' });
}

onMounted(() => {
  loadMyActivities();
});
</script>

<template>
  <section class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-darkText flex items-center gap-3">
        <LucideIcon name="calendar" class="text-accent" />
        Mis Actividades
      </h2>

      <button
        @click="goToActivityList"
        class="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        aria-label="Ver todas mis actividades"
      >
        Ver todas
      </button>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Lista de actividades -->
    <div v-else-if="activities && activities.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="activity in activities.slice(0, 6)"
        :key="activity.activity_id"
        class="bg-card border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
      >
        <div>
          <p class="text-base font-bold text-primary">
            {{ activity.activity_name || 'Actividad sin título' }}
          </p>

          <p class="text-sm text-gray-600 mt-2 line-clamp-3">
            {{ activity.activity_description || 'Sin descripción' }}
          </p>
        </div>

        <div class="mt-3 flex items-center justify-between">
          <span class="text-xs text-gray-500 flex items-center gap-1.5">
            <LucideIcon name="calendar" :size="14" />
            {{
              activity.activity_datetime
                ? new Date(activity.activity_datetime).toLocaleDateString('es-PA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : 'Fecha no disponible'
            }}
          </span>

          <RouterLink
            :to="{ name: 'ActivityDetail', params: { id: activity.activity_id } }"
            class="px-3 py-1 text-xs font-bold text-white bg-primary rounded-full hover:bg-primary-dark transition-colors"
            aria-label="Ver detalles de la actividad"
          >
            Ver Detalles
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Sin actividades -->
    <div v-else class="text-center py-8 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <p class="text-gray-500 mb-2">No tienes próximas actividades inscritas.</p>
      <button @click="goToActivityList" class="mt-2 inline-block text-primary font-semibold hover:underline">
        Buscar actividades
      </button>
    </div>
  </section>
</template>
