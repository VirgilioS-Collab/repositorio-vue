<script setup lang="ts">
/**
 * @file: src/views/club/Dashboard.vue
 * @description: Dashboard principal para administradores de club.
 * - CORREGIDO: Se reestructura la tabla de "Próximos Eventos" para usar
 * correctamente las directivas v-if/v-else y evitar el error de compilación "Codegen".
 */
import { computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

// Componentes UI
import EChartGeneric from '@/components/ui/EChartGeneric.vue';
import StatCard from '@/components/ui/StatCard.vue';
import LucideIcon from '@/components/ui/LucideIcon.vue';

// Pinia stores
import { useMemberStore } from '@/store/useMemberStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { storeToRefs } from 'pinia';

// 1) Obtener clubId de la ruta
const route = useRoute();
const clubId = computed(() => Number(route.params.id));

// 2) Instanciar stores
const memberStore = useMemberStore();
const activityStore = useActivityStore();
const financeStore = useFinanceStore();

// 3) Hacer el estado reactivo con storeToRefs
const { stats: memberStats } = storeToRefs(memberStore);
const { items: activities, loading: activityLoading } = storeToRefs(activityStore);
const { flow: financeFlow, hasFunds } = storeToRefs(financeStore);

// 4) KPI computados
const activeKpi = computed(() => memberStats.value?.active ?? 0);
const upcomingKpi = computed(() => activities.value.filter(a => new Date(a.activity_datetime) >= new Date()).length);
const totalIncome = computed(() => financeFlow.value.incomes.reduce((sum, val) => sum + val, 0));
const totalBalance = computed(() => {
  const income = financeFlow.value.incomes.reduce((s, v) => s + v, 0);
  const expense = financeFlow.value.expenses.reduce((s, v) => s + v, 0);
  return income - expense;
});

// Opciones para las gráficas
const memberFlowChartOption = computed(() => ({
  title: { text: 'Altas vs. Bajas de Miembros (Últimos 6 meses)', left: 'center', textStyle: { fontSize: 16 } },
  tooltip: { trigger: 'axis' },
  legend: { data: ['Altas', 'Bajas'], top: 30 },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Altas', type: 'line', data: [5, 8, 4, 10, 6, 12], smooth: true },
    { name: 'Bajas', type: 'line', data: [1, 2, 1, 3, 2, 1], smooth: true, color: '#ef4444' }
  ]
}));

const financeChartOption = computed(() => ({
  title: { text: 'Ingresos vs. Egresos', left: 'center', textStyle: { fontSize: 16 } },
  tooltip: { trigger: 'axis' },
  legend: { data: ['Ingresos', 'Egresos'], top: 30 },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: financeFlow.value.months },
  yAxis: { type: 'value' },
  series: [
    { name: 'Ingresos', type: 'bar', data: financeFlow.value.incomes, itemStyle: { color: '#22c55e' } },
    { name: 'Egresos', type: 'bar', data: financeFlow.value.expenses, itemStyle: { color: '#ef4444' } }
  ]
}));

onMounted(() => {
  if (clubId.value) {
    memberStore.fetchStats(clubId.value);
    // Para el modo de prueba, los datos de actividades ya están moqueados en el store
    // activityStore.fetchAll(clubId.value); 
    financeStore.fetchFlow(); 
  }
});
</script>

<template>
  <div>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="Miembros Activos" :value="activeKpi" icon="users" color="blue-500" />
      <StatCard label="Eventos Próximos" :value="upcomingKpi" icon="calendar-check" color="purple-500" />
      <StatCard label="Recaudo del Mes" :value="`$${totalIncome.toFixed(2)}`" icon="trending-up" color="green-500" />
      <StatCard label="Saldo Disponible" :value="`$${totalBalance.toFixed(2)}`" icon="dollar-sign" color="yellow-500" />
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-sm border h-80">
        <EChartGeneric :option="memberFlowChartOption" />
      </div>
      <div v-if="hasFunds" class="bg-white p-6 rounded-xl shadow-sm border h-80">
        <EChartGeneric :option="financeChartOption" />
      </div>
      <div v-else class="bg-white p-6 rounded-xl shadow-sm border h-80 flex flex-col items-center justify-center text-center text-gray-500">
        <LucideIcon name="piggy-bank" :size="40" class="mb-4"/>
        <h4 class="font-semibold text-lg">Módulo Financiero</h4>
        <p class="text-sm">Este club no maneja fondos actualmente.</p>
        <p class="text-xs mt-2">Puedes activarlo en la sección de Ajustes.</p>
      </div>
    </section>

    <section class="bg-white p-6 rounded-xl shadow-sm border">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-darkText">Próximos Eventos</h3>
            <RouterLink :to="{ name: 'club-activities', params: { id: clubId } }" class="text-sm font-semibold text-primary hover:underline">
                Ver todo &rarr;
            </RouterLink>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cupo</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="activityLoading">
                        <td colspan="4" class="text-center py-8 text-gray-500">Cargando eventos...</td>
                    </tr>
                    <template v-else>
                        <tr v-if="activities.length === 0">
                           <td colspan="4" class="text-center py-8 text-gray-500">No hay eventos próximos.</td>
                        </tr>
                        <tr v-else v-for="activity in activities.slice(0, 5)" :key="activity.activity_id" class="hover:bg-soft">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ activity.activity_name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(activity.activity_datetime).toLocaleDateString('es-PA') }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ activity.participants_count || 0 }}/{{ activity.max_participants || '∞' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                      :class="activity.activity_status_id === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                                    {{ activity.activity_status_name || 'Desconocido' }}
                                </span>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </section>
  </div>
</template>