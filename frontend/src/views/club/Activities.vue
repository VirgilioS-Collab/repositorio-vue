<script setup lang="ts">
/**
 * @file: src/views/club/Activities.vue
 * @description: Vista para la gestión de actividades (eventos) de un club.
 * - REFACTORIZADO: Se reemplaza FullCalendar por ECharts.
 */
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useActivityStore } from '@/store/useActivityStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseChart from '@/components/ui/BaseChart.vue';
import type { ActivityDTO } from '@/services/dao/models/Activity';

// --- STORES Y ESTADO ---
const route = useRoute();
const activityStore = useActivityStore();
const { activities, loading } = storeToRefs(activityStore);
const clubId = Number(route.params.id);

// --- ESTADO LOCAL DEL COMPONENTE ---
const filters = ref({ keyword: '', type: 'all', status: 'all', startDate: '', endDate: '' });
const showActivityModal = ref(false);
const editingActivity = ref<any>(null);

// --- PROPIEDADES COMPUTADAS ---
const filteredActivities = computed(() => {
  return activities.value.filter((act: ActivityDTO) => {
    const activityDate = new Date(act.schedules?.[0]?.start_date || '');
    const start = filters.value.startDate ? new Date(filters.value.startDate) : null;
    const end = filters.value.endDate ? new Date(filters.value.endDate) : null;

    const keywordMatch = filters.value.keyword.trim() === '' || act.ga_activity_name.toLowerCase().includes(filters.value.keyword.toLowerCase());
    const typeMatch = filters.value.type === 'all' || act.ga_activity_type === filters.value.type;
    const statusMatch = filters.value.status === 'all' || act.ga_activity_status === filters.value.status;
    const dateMatch = (!start || activityDate >= start) && (!end || activityDate <= end);

    return keywordMatch && typeMatch && statusMatch && dateMatch;
  });
});

const calendarChartData = computed(() => {
  const activityCountsByDate: { [key: string]: number } = {};
  filteredActivities.value.forEach(activity => {
    const date = activity.schedules?.[0]?.start_date.split('T')[0];
    if (date) {
      activityCountsByDate[date] = (activityCountsByDate[date] || 0) + 1;
    }
  });
  return Object.entries(activityCountsByDate).map(([date, count]) => [date, count]);
});

const calendarOptions = computed(() => ({
  tooltip: { formatter: '{c} actividad(es) en {b}' },
  visualMap: {
    min: 0,
    max: Math.max(...calendarChartData.value.map(d => d[1] as number), 1),
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    top: 'top',
    inRange: { color: ['#D4E3FF', '#00205B'] },
  },
  calendar: {
    range: new Date().getFullYear().toString(),
    cellSize: ['auto', 20],
    dayLabel: { nameMap: 'es' },
    monthLabel: { nameMap: 'es' },
    top: 70,
  },
  series: {
    type: 'heatmap',
    coordinateSystem: 'calendar',
    data: calendarChartData.value,
  },
}));

// --- MÉTODOS ---
function openCreateModal() {
  editingActivity.value = { ga_activity_type: 'Reunión', ga_activity_status: 'Programada' };
  showActivityModal.value = true;
}

function openEditModal(activity: any) {
  editingActivity.value = { ...activity };
  showActivityModal.value = true;
}

function saveActivity() {
  if (editingActivity.value) {
    if (editingActivity.value.activity_id) {
      activityStore.updateActivity(editingActivity.value.activity_id, editingActivity.value);
    } else {
      activityStore.createActivity(clubId, editingActivity.value);
    }
  }
  showActivityModal.value = false;
  editingActivity.value = null;
}

function deleteActivity(activityId: number) {
  if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
    activityStore.deleteActivity(activityId);
  }
}

// --- CICLO DE VIDA ---
onMounted(() => {
  activityStore.fetchActivities();
});
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center flex-wrap gap-4">
        <h2 class="text-2xl font-bold text-darkText">Gestión de Actividades</h2>
        <div class="flex-shrink-0">
            <BaseButton @click="openCreateModal">
                <template #icon>
                    <LucideIcon name="plus" :size="18"/>
                </template>
                Crear Actividad
            </BaseButton>
        </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border" style="height: 350px;">
        <BaseChart :option="calendarOptions" />
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input v-model="filters.keyword" type="text" placeholder="Buscar por palabra clave..." class="input-focus-effect md:col-span-2"/>
            <select v-model="filters.type" class="input-focus-effect">
                <option value="all">Todos los tipos</option>
                <option>Reunión</option><option>Taller</option><option>Torneo</option>
            </select>
            <select v-model="filters.status" class="input-focus-effect">
                <option value="all">Todos los estados</option>
                <option>Programada</option><option>Realizada</option><option>Cancelada</option>
            </select>
            <input type="date" v-model="filters.startDate" class="input-focus-effect" />
            <input type="date" v-model="filters.endDate" class="input-focus-effect" />
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="th-cell">Nombre</th><th class="th-cell">Tipo</th><th class="th-cell">Fecha</th><th class="th-cell">Cupo Máximo</th><th class="th-cell">Plazas Disponibles</th><th class="th-cell">Estado</th><th class="th-cell">Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="loading"><td colspan="5" class="td-cell text-center">Cargando...</td></tr>
                    <tr v-else-if="filteredActivities.length === 0"><td colspan="5" class="td-cell text-center">No se encontraron actividades.</td></tr>
                    <tr v-else v-for="act in filteredActivities" :key="act.activity_id" class="hover:bg-soft">
                        <td class="td-cell font-medium">{{ act.ga_activity_name }}</td>
                        <td class="td-cell">{{ act.ga_activity_type }}</td>
                        <td class="td-cell">{{ new Date(act.schedules?.[0]?.start_date || '').toLocaleString('es-PA') }}</td>
                        <td class="td-cell">{{ act.ga_max_capacity ?? 0 }}</td>
                        <td class="td-cell">{{ (act.ga_max_capacity ?? 0) - (act.ga_current_participants ?? 0) }}</td>
                        <td class="td-cell"><span class="status-pill" :class="act.ga_activity_status === 'Programada' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'">{{ act.ga_activity_status }}</span></td>
                        <td class="td-cell space-x-2">
                            <button @click="openEditModal(act)" class="text-primary hover:text-primary-dark"><LucideIcon name="edit" :size="16"/></button>
                            <button @click="deleteActivity(act.activity_id)" class="text-red-600 hover:text-red-800"><LucideIcon name="trash-2" :size="16"/></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-if="showActivityModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div class="p-6">
                <h3 class="text-lg font-bold mb-4">{{ editingActivity.activity_id ? 'Editar' : 'Crear' }} Actividad</h3>
                <div class="space-y-4">
                    <input type="text" placeholder="Nombre de la actividad" v-model="editingActivity.ga_activity_name" class="input-focus-effect w-full"/>
                    <textarea placeholder="Descripción" v-model="editingActivity.ga_activity_description" class="input-focus-effect w-full" rows="3"></textarea>
                </div>
            </div>
            <div class="bg-gray-50 p-4 flex justify-end gap-3">
                <BaseButton @click="showActivityModal = false" variant="secondary">Cancelar</BaseButton>
                <BaseButton @click="saveActivity">Guardar</BaseButton>
            </div>
        </div>
    </div>
  </div>
</template>