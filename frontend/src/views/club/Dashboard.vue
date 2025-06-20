<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

// ECharts Core & Components
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { PieChart, BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

// Pinia stores
import { useMemberStore } from '@/store/useMemberStore'
import { useActivityStore } from '@/store/useActivityStore'

// 1) Pull clubId from route
const route = useRoute()
const clubId = computed(() => Number(route.params.id))

// 2) Instantiate stores
const memberStore   = useMemberStore()
const activityStore = useActivityStore()

// 3) KPI computed props
const activeKpi   = computed(() => memberStore.stats?.active   ?? 0)
const newKpi      = computed(() => memberStore.stats?.newMembers ?? 0)
const droppedKpi  = computed(() => memberStore.stats?.droppedMembers ?? 0)
const upcomingKpi = computed(() => activityStore.items.length     ?? 0)

// 4) Refs for chart containers
const pieChartRef = ref<HTMLElement|null>(null)
const barChartRef = ref<HTMLElement|null>(null)

// 5) Chart instances
let pieChart: echarts.ECharts
let barChart: echarts.ECharts

onMounted(async () => {
  // register needed ECharts packages
  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    PieChart,
    BarChart,
    CanvasRenderer
  ])

  // fetch data
  await memberStore.fetchStats(clubId.value)
  await activityStore.fetchAll(clubId.value)

  // wait DOM before init
  nextTick(() => {
    if (pieChartRef.value) {
      pieChart = echarts.init(pieChartRef.value)
      pieChart.setOption({
        title: { text: 'Miembros del Club', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
          name: 'Miembros', type: 'pie', radius: '50%',
          data: [
            { value: memberStore.stats!.active,     name: 'Activos' },
            { value: memberStore.stats!.newMembers, name: 'Nuevos' },
            { value: memberStore.stats!.droppedMembers, name: 'Bajas' }
          ]
        }]
      })
    }

    if (barChartRef.value) {
      // group activities by type
      const byType = activityStore.items.reduce<Record<string, number>>((acc, a) => {
        const t = String(a.activity_type)
        acc[t] = (acc[t] || 0) + 1
        return acc
      }, {})
      const types = Object.keys(byType)
      const counts = types.map(t => byType[t])

      barChart = echarts.init(barChartRef.value)
      barChart.setOption({
        title: { text: 'Actividades por Tipo', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: types },
        yAxis: { type: 'value' },
        series: [{
          name: 'Eventos', type: 'bar', data: counts,
          itemStyle: { borderRadius: 4 }
        }]
      })
    }
  })
})
</script>

<template>
  <template #title>Dashboard</template>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <p class="text-sm text-gray-500">Miembros activos</p>
      <h3 class="text-2xl font-bold text-utp-blue mt-1">{{ activeKpi }}</h3>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <p class="text-sm text-gray-500">Miembros nuevos</p>
      <h3 class="text-2xl font-bold text-utp-blue mt-1">{{ newKpi }}</h3>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <p class="text-sm text-gray-500">Bajas de miembros</p>
      <h3 class="text-2xl font-bold text-utp-blue mt-1">{{ droppedKpi }}</h3>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <p class="text-sm text-gray-500">Eventos próximos</p>
      <h3 class="text-2xl font-bold text-utp-blue mt-1">{{ upcomingKpi }}</h3>
    </div>
  </section>

  <section class="bg-white p-6 rounded-lg shadow-sm border mb-8 h-64">
    <div ref="pieChartRef" class="w-full h-full"></div>
  </section>

  <section class="bg-white p-6 rounded-lg shadow-sm border mb-8 h-64">
    <div ref="barChartRef" class="w-full h-full"></div>
  </section>
</template>

<style scoped>
/* ensure chart containers fill their parent */
div[ref="pieChartRef"],
div[ref="barChartRef"] {
  width: 100%;
  height: 100%;
}
</style>
