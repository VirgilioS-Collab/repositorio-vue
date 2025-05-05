<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/useUserStore'
import LucideIcon from '@/components/ui/LucideIcon.vue'
import { ICONS }  from '@/utils/icons'

const store = useUserStore()
const { user } = storeToRefs(store)
function openProfile() { store.openModal('viewProfile') }
</script>

<template>
  <!-- Barra de fondo -->
  <nav class="bg-primary text-white h-16 fixed inset-x-0 top-0 z-50 shadow-md">
    <!-- Contenedor centrado -->
    <div class="max-w-screen-lg mx-auto h-full flex items-center justify-between px-6">
      <!-- Marca -->
      <div class="flex items-center gap-2">
        <LucideIcon :name="ICONS.book" size="24" class="text-accent" />
        <span class="text-lg font-bold">Agenda&nbsp;Academia</span>
      </div>

      <!-- Avatar -->
      <button @click="openProfile" class="focus:outline-none">
        <img :src="user.profileImage" alt="avatar" class="w-8 h-8 rounded-full object-cover" />
      </button>
    </div>
  </nav>
</template>
