<template>
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4">Historial de Actividades</h2>
    
    <div class="mb-4 flex space-x-4">
      <input type="text" v-model="searchQuery" placeholder="Buscar por palabra clave..." class="p-2 border rounded-md w-1/3">
      <input type="date" v-model="startDate" class="p-2 border rounded-md">
      <input type="date" v-model="endDate" class="p-2 border rounded-md">
    </div>

    <div class="bg-white shadow-md rounded-lg p-4">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Aquí se iterará sobre las actividades del usuario -->
          <tr v-for="activity in filteredActivities" :key="activity.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ activity.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ activity.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ activity.role }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="activity.status === 'Asistió' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ activity.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Datos de ejemplo
const activities = ref([
  { id: 1, name: 'Taller de Vue.js', date: '2024-07-01', role: 'Participante', status: 'Asistió' },
  { id: 2, name: 'Conferencia de IA', date: '2024-06-15', role: 'Organizador', status: 'Asistió' },
  { id: 3, name: 'Hackathon', date: '2024-05-20', role: 'Participante', status: 'No Asistió' },
]);

const searchQuery = ref('');
const startDate = ref('');
const endDate = ref('');

const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    const activityDate = new Date(activity.date);
    const start = startDate.value ? new Date(startDate.value) : null;
    const end = endDate.value ? new Date(endDate.value) : null;

    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesDate = (!start || activityDate >= start) && (!end || activityDate <= end);

    return matchesSearch && matchesDate;
  });
});
</script>
