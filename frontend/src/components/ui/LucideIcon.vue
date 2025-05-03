<script setup lang="ts">
/**
 * Componente adaptador para iconos Lucide.
 * ▸ Si recibe una *clave* del catálogo (`calendar`, `cpu`, …)
 *   la transforma al componente Lucide correspondiente.
 * ▸ Si recibe directamente `BookIcon`, `UserIcon`, etc.,
 *   lo usa tal cual (retro-compatibilidad).
 */
import { computed } from 'vue'
import * as Lucide from 'lucide-vue-next'
import { ICONS }   from '@/utils/icons'

type CatalogKey = keyof typeof ICONS
type LucideKey   = keyof typeof Lucide

const props = defineProps<{

  name : CatalogKey | LucideKey
  /** Tamaño en px / em (por defecto 24) */
  size?: number | string
}>()

/* Resuelve el componente SVG */
const IconComp = computed(() => {
  // 1) Nombre de catálogo (ej: 'map-pin')
  if (props.name in ICONS) {
    const real = ICONS[props.name as CatalogKey]
    const pascal = real.replace(/(^\w|-\w)/g,
        s => s.replace('-', '').toUpperCase())
    const key = `${pascal}Icon` as LucideKey
    return Lucide[key] ?? Lucide.HelpCircleIcon
  }

  // 2) Nombre PascalCase directo
  const key = props.name as LucideKey
  return Lucide[key] ?? Lucide.HelpCircleIcon
})
</script>

<template>
  <component :is="IconComp" :size="size ?? 24" v-bind="$attrs" />
</template>
