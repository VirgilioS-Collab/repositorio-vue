<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/useUserStore'      /* ← tu carpeta “store” */
import AppNavbar from '@/components/AppNavbar.vue'
import { RouterView } from 'vue-router'

/* -------- estado necesario para el navbar ---------- */
const store = useUserStore()
const {
  user, showProfileDropdown      // refs que el navbar necesita
} = storeToRefs(store)

/* -------- acciones que el navbar emite -------------- */
function toggleProfileDropdown() {
  store.showProfileDropdown = !store.showProfileDropdown
}
function openModal(modal) {
  store.openModal(modal)
}
/* si decides implementar logout en el store: */
// function logout() { store.logout() }
</script>

<template>
  <AppNavbar
      :showProfileDropdown="showProfileDropdown"
      :user="user"
      @openModal="openModal"
      @toggleProfileDropdown="toggleProfileDropdown"
  />

  <!-- Contenido desplazado 64 px (altura del navbar) -->
  <div class="pt-16">
    <RouterView />
  </div>
</template>
