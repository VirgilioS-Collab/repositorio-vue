<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/useUserStore'
import AppNavbar from '@/components/AppNavbar.vue'
import { RouterView } from 'vue-router'

/* -------- estado necesario para el navbar ---------- */
const userStore = useUserStore()
const {
  showProfileDropdown
} = storeToRefs(userStore)

/* -------- acciones que el navbar emite -------------- */
function toggleProfileDropdown() {
  userStore.toggleProfileDropdown()
}
function openModal(modal: string) {
  userStore.openModal(modal as any)
}
/* si decides implementar logout en el store: */
// function logout() { store.logout() }
</script>

<template>
  <AppNavbar
      :showProfileDropdown="showProfileDropdown"
      @openModal="openModal"
      @toggleProfileDropdown="toggleProfileDropdown"
  />

  <!-- Contenido principal de la aplicación -->
  <main class="bg-gray-50 min-h-screen">
    <div class="pt-16">
      <RouterView />
    </div>
  </main>
</template>
