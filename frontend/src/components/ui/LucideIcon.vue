<script setup lang="ts">
import { computed } from 'vue'
import * as Lucide from 'lucide-vue-next'
import { ICONS } from '@/utils/icons'

type CatKey = keyof typeof ICONS
type LucideKey = keyof typeof Lucide

/* kebab → Pascal  ("layout-dashboard" → "LayoutDashboard") */
const toPascal = (k: string) =>
    k.replace(/(^\w|-\w)/g, s => s.replace('-', '').toUpperCase())

const props = defineProps<{
  /**  Clave de catálogo o nombre Lucide (kebab/Pascal/PascalIcon)  */
  name: CatKey | LucideKey | string
  size?: number
}>()

/* Resuelve el componente SVG real -------------------------------------- */
const IconComp = computed(() => {
  // 1) clave de catálogo
  if (props.name in ICONS) {
    const pascal = toPascal(ICONS[props.name as CatKey]) + 'Icon'
    return Lucide[pascal as LucideKey] ?? Lucide.HelpCircleIcon
  }
  // 2) kebab o Pascal directo
  const raw = props.name
  const pascal = raw.match(/[A-Z]/) ? raw : toPascal(raw)
  const lucide = pascal.endsWith('Icon') ? pascal : pascal + 'Icon'
  return Lucide[lucide as LucideKey] ?? Lucide.HelpCircleIcon
})
</script>

<template>
  <!--  ⚠️ CAS T → se deja de comprobar los props “iconNode, name, …” -->
  <component :is="(IconComp as any)" :size="props.size ?? 24" />
</template>