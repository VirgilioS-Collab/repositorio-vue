<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useMemberStore } from '@/store/useMemberStore'
import LucideIcon from '@/components/ui/LucideIcon.vue'

const memberStore = useMemberStore()
const search      = ref('')
const stateFilter = ref('Todos los estados')
const roleFilter  = ref('Todos los roles')

onMounted(() => memberStore.fetchAll())

const filtered = computed(() => {
  let arr = memberStore.items
  // … tus filtros …
  return arr
})
// paginación igual, pero siempre con memberStore.items
</script>

<template>
  <header>…</header>
  <input v-model="search" />
  <table>
    <tr v-for="m in filtered" :key="m.id">…</tr>
  </table>
  <button @click="memberStore.approve(m.id)">Aprobar</button>
  <!-- etc. -->
</template>
