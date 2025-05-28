<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute }   from 'vue-router'
import { useClubStore } from '@/store/useClubStore'
import LucideIcon from '@/components/ui/LucideIcon.vue'

const clubStore = useClubStore()
const route     = useRoute()
const id        = Number(route.params.id)

// extraemos con storeToRefs() si quieres
// const { details, history, accessLog } = storeToRefs(clubStore)

onMounted(() => {
  // solo a través del store
  clubStore.fetchDetails(id)
  clubStore.fetchHistory(id)
  clubStore.fetchAccessLog(id)
})

function saveDetails() {
  clubStore.updateDetails(id, clubStore.details)
}

function saveSocial() {
  clubStore.updateSocialLinks(id, {
    facebook : clubStore.details.facebook,
    instagram: clubStore.details.instagram,
    twitter  : clubStore.details.twitter
  })
}
</script>

<template>
  <header>…</header>

  <!-- Información del Club -->
  <div>
    <input v-model="clubStore.details.name" … />
    <!-- resto igual -->
    <button @click="saveDetails">Guardar cambios</button>
  </div>

  <!-- Redes Sociales -->
  <div>
    <input v-model="clubStore.details.facebook" … />
    <!-- resto igual -->
    <button @click="saveSocial">Guardar enlaces</button>
  </div>

  <!-- Historial y accesos -->
  <div v-for="h in clubStore.history" :key="h.id">…</div>
  <div v-for="r in clubStore.accessLog" :key="r.id">…</div>
</template>
