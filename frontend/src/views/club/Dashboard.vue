<script setup lang="ts">
/**
 * @file: src/views/club/Dashboard.vue
 * @description: Dashboard principal para administradores de club.
 * - CORREGIDO: Se ajusta la sintaxis de importación de useFinanceStore
 * para que coincida con su exportación nombrada.
 */
import { computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import StatCard from '@/components/ui/StatCard.vue';
import EChartGeneric from '@/components/ui/EChartGeneric.vue';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { useMemberStore } from '@/store/useMemberStore';
import { useActivityStore } from '@/store/useActivityStore';
// ESTA ES LA LÍNEA CORREGIDA
import { useFinanceStore } from '@/store/useFinanceStore';
import { storeToRefs } from 'pinia';

// --- STORES Y ROUTER ---
const route = useRoute();
const clubId = computed(() => Number(route.params.id));
const memberStore = useMemberStore();
const activityStore = useActivityStore();
const financeStore = useFinanceStore();

// --- ESTADO REACTIVO ---
const { stats: memberStats } = storeToRefs(memberStore);
const { items: activities, loading: activityLoading } = storeToRefs(activityStore);
const { summary: financeSummary, hasFunds } = storeToRefs(financeStore);

// --- KPIs COMPUTADOS ---
const activeKpi = computed(() => memberStats.value?.active ?? 0);
const upcomingKpi = computed(() => activities.value.filter(a => new Date(a.activity_datetime) >= new Date()).length);
const totalIncome = computed(() => financeSummary.value?.income ?? 0);
const totalBalance = computed(() => financeSummary.value?.balance ?? 0);

// --- OPCIONES DE GRÁFICAS ---
// (Estas opciones se mantienen, ya que son de configuración de UI)
const memberFlowChartOption = computed(() => ({
  title: { text: 'Altas vs. Bajas de Miembros', left: 'center', textStyle: { fontSize: 16 } },
  tooltip: { trigger: 'axis' },
  legend: { data: ['Altas', 'Bajas'], top: 30 },
  xAxis: { type: 'category', data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Altas', type: 'line', data: [5, 8, 4, 10, 6, 12] },
    { name: 'Bajas', type: 'line', data: [1, 2, 1, 3, 2, 1] }
  ]
}));
const financeChartOption = computed(() => ({ /* ... */ }));

// --- CICLO DE VIDA ---
onMounted(() => {
  if (clubId.value) {
    memberStore.fetchStats(clubId.value);
    activityStore.fetchAllForAdmin(clubId.value);
    if (hasFunds.value) {
      financeStore.fetchSummary(clubId.value);
    }
  }
});
</script>

<template>
  <div>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="Miembros Activos" :value="activeKpi" icon="users" color="text-blue-500" />
      <StatCard label="Eventos Próximos" :value="upcomingKpi" icon="calendar-check" color="text-purple-500" />
      <StatCard v-if="hasFunds" label="Recaudo del Mes" :value="`$${totalIncome.toFixed(2)}`" icon="trending-up" color="text-green-500" />
      <StatCard v-if="hasFunds" label="Saldo Disponible" :value="`$${totalBalance.toFixed(2)}`" icon="dollar-sign" color="text-yellow-500" />
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
      </div>
    </section>

    <section class="bg-white p-6 rounded-xl shadow-sm border">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-darkText">Próximos Eventos</h3>
            <RouterLink :to="{ name: 'Activities', params: { id: clubId } }" class="text-sm font-semibold text-primary hover:underline">
                Ver todo &rarr;
            </RouterLink>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="activityLoading"><td colspan="3" class="text-center py-8">Cargando...</td></tr>
                    <tr v-else-if="activities.length === 0"><td colspan="3" class="text-center py-8">No hay eventos próximos.</td></tr>
                    <tr v-else v-for="activity in activities.slice(0, 5)" :key="activity.activity_id" class="hover:bg-soft">
                        <td class="px-6 py-4 font-medium">{{ activity.activity_name }}</td>
                        <td class="px-6 py-4">{{ new Date(activity.activity_datetime).toLocaleDateString('es-PA') }}</td>
                        <td class="px-6 py-4"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{{ activity.activity_status_name }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
  </div>
</template>