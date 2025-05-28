<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useActivityStore } from '@/store/useActivityStore'
import LucideIcon from '@/components/ui/LucideIcon.vue'

const activityStore = useActivityStore()
const search        = ref('')
const page          = ref(1)
const perPage       = 5

onMounted(() => activityStore.fetchAll())

const calendarEvents = computed(() =>
    activityStore.items.map(a => ({ title:a.title, start:a.datetime, /* color */ }))
)

const filtered = computed(() =>
    activityStore.items.filter(a =>
        a.title.toLowerCase().includes(search.value.toLowerCase())
    )
)
</script>

<template>
  <FullCalendar :plugins="[dayGridPlugin,interactionPlugin]" :events="calendarEvents"/>
  <input v-model="search" placeholder="Buscar…"/>
  <table>
    <tr v-for="a in filtered" :key="a.id">…</tr>
  </table>
</template>
