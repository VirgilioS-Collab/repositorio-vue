<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  TitleComponent
} from 'echarts/components'
import {
  BarChart,
  LineChart,
  HeatmapChart
} from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

// registramos solo lo que necesitamos
echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  TitleComponent,
  BarChart,
  LineChart,
  HeatmapChart,
  CanvasRenderer
])

// recibimos la opción completa
const props = defineProps<{
  option: Record<string, any>
}>()

const chartEl = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

function drawChart() {
  if (!chartEl.value) return
  chart ??= echarts.init(chartEl.value)
  chart.setOption(props.option)
}

onMounted(drawChart)
watch(() => props.option, drawChart, { deep: true })
onBeforeUnmount(() => chart && chart.dispose())
</script>

<template>
  <div ref="chartEl" class="w-full h-full" />
</template>
