<script setup lang="ts">
import LucideIcon from '@/components/ui/LucideIcon.vue';
import type { ActivityDTO } from '@/services/dao/models/Activity';

defineProps<{
  activities: ActivityDTO[] | undefined
}>();
</script>

<template>
  <div class="bg-card border border-gray-200 rounded-xl shadow-sm p-5">
    <h3 class="font-bold text-lg text-darkText flex items-center gap-2 mb-4">
      <LucideIcon name="zap" :size="20" class="text-accent"/>
      Próximos Eventos
    </h3>
    <div v-if="activities && activities.length > 0" class="space-y-3">
      <div v-for="activity in activities.slice(0, 3)" :key="activity.activity_id" class="flex items-start gap-3">
        <div class="bg-accent/10 text-accent font-bold p-2 rounded-lg text-center leading-none">
          <p class="text-xs">{{ activity.schedules?.[0]?.start_date ? new Date(activity.schedules[0].start_date).toLocaleString('es-PA', { month: 'short' }) : 'N/A' }}</p>
          <p class="text-lg">{{ activity.schedules?.[0]?.start_date ? new Date(activity.schedules[0].start_date).getDate() : 'N/A' }}</p>
        </div>
        <div>
          <p class="font-semibold text-primary">{{ activity.ga_activity_name }}</p>
          <p class="text-xs text-gray-500">{{ activity.ga_group_id }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-sm text-gray-500">No hay eventos próximos.</div>
  </div>
</template>