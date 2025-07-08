<script setup lang="ts">
/**
 * @file: src/views/club/Activities.vue
 * @description: Vista para la gestión de actividades (eventos) de un club.
 * - INTEGRA: El diseño de UI completo con la arquitectura de stores correcta.
 */
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useActivityStore } from '@/store/useActivityStore';
import { storeToRefs } from 'pinia';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import type { ActivityDTO } from '@/services/dao/models/Activity';

// --- STORES Y ESTADO ---
const route = useRoute();
const activityStore = useActivityStore();
const { activities, loading } = storeToRefs(activityStore);
const clubId = Number(route.params.id);

// --- ESTADO LOCAL DEL COMPONENTE ---
const filters = ref({ keyword: '', type: 'all', status: 'all' });
const showActivityModal = ref(false);
const editingActivity = ref<any>(null);

// --- PROPIEDADES COMPUTADAS ---
const filteredActivities = computed(() => {
  return activities.value.filter((act: ActivityDTO) => {
    const keywordMatch = filters.value.keyword.trim() === '' || act.ga_activity_name.toLowerCase().includes(filters.value.keyword.toLowerCase());
    const typeMatch = filters.value.type === 'all' || act.ga_activity_type === filters.value.type;
    const statusMatch = filters.value.status === 'all' || act.ga_activity_status === filters.value.status;
    return keywordMatch && typeMatch && statusMatch;
  });
});

const calendarEvents = computed(() => {
    return filteredActivities.value.map(act => ({
        id: String(act.activity_id),
        title: act.ga_activity_name,
        start: act.schedules?.[0]?.start_date,
        backgroundColor: act.ga_activity_status === 'Programada' ? '#00205B' : '#6b7280',
        borderColor: act.ga_activity_status === 'Programada' ? '#00205B' : '#6b7280',
    }));
});

const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth' },
    events: calendarEvents.value,
    locale: 'es',
    buttonText: { today: 'Hoy', month: 'Mes' },
    aspectRatio: 1.75,
    height: 'auto'
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
  console.log("Guardando actividad:", editingActivity.value);
  // Aquí llamarías a la acción del store:
  // if (editingActivity.value.activity_id) {
  //   activityStore.updateActivity(editingActivity.value.activity_id, editingActivity.value);
  // } else {
  //   activityStore.createActivity(clubId, editingActivity.value);
  // }
  showActivityModal.value = false;
  editingActivity.value = null;
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
            <button @click="openCreateModal" class="btn-primary-admin flex items-center gap-2">
                <LucideIcon name="plus" :size="18"/>
                Crear Actividad
            </button>
        </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border">
        <FullCalendar :options="calendarOptions" />
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
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="th-cell">Nombre</th><th class="th-cell">Tipo</th><th class="th-cell">Fecha</th><th class="th-cell">Estado</th><th class="th-cell">Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="loading"><td colspan="5" class="td-cell text-center">Cargando...</td></tr>
                    <tr v-else-if="filteredActivities.length === 0"><td colspan="5" class="td-cell text-center">No se encontraron actividades.</td></tr>
                    <tr v-else v-for="act in filteredActivities" :key="act.activity_id" class="hover:bg-soft">
                        <td class="td-cell font-medium">{{ act.ga_activity_name }}</td>
                        <td class="td-cell">{{ act.ga_activity_type }}</td>
                        <td class="td-cell">{{ new Date(act.schedules?.[0]?.start_date || '').toLocaleString('es-PA') }}</td>
                        <td class="td-cell"><span class="status-pill" :class="act.ga_activity_status === 'Programada' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'">{{ act.ga_activity_status }}</span></td>
                        <td class="td-cell space-x-2">
                            <button @click="openEditModal(act)" class="text-primary hover:text-primary-dark"><LucideIcon name="edit" :size="16"/></button>
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
                <button @click="showActivityModal = false" class="btn-secondary-admin">Cancelar</button>
                <button @click="saveActivity" class="btn-primary-admin">Guardar</button>
            </div>
        </div>
    </div>
  </div>
</template>