<script setup lang="ts">
import LucideIcon from '@/components/ui/LucideIcon.vue'

interface Props {
  label : string
  value : string | number
  icon  : string
  color : string
}
defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex justify-between">
    <div>
      <p class="text-sm font-medium text-gray-500">{{ label }}</p>
      <h3 class="text-2xl font-bold text-utp-blue mt-1">{{ value }}</h3>
    </div>
    <div :class="['p-3 rounded-full bg-blue-50', `text-${color}`]">
      <LucideIcon :name="icon" class="w-6 h-6" />
    </div>
  </div>
</template>
