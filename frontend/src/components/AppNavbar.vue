<!--
  Componente “AppNavbar”
  ------------------------------------------------------------------
  • Barra superior con título y avatar.
  • El avatar abre un menú con acciones que se comunican por emits.
  • Iconografía centralizada vía <LucideIcon /> + catálogo ICONS.
  ------------------------------------------------------------------
-->

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import LucideIcon                 from '@/components/ui/LucideIcon.vue'
import { ICONS }                  from '@/utils/icons'

/* ---------- props ---------- */
defineProps<{
  user: {
    name:         string
    role:         string
    profileImage: string
  }
  showProfileDropdown: boolean
}>()

/* ---------- emits ---------- */
defineEmits<{
  (e:'toggleProfileDropdown'): void
  (e:'openModal', modal:'viewProfile'|'editProfile'|'security'): void
  (e:'logout'): void
}>()
</script>

<template>
  <nav class="bg-[#00205B] text-white p-4 fixed inset-x-0 top-0 z-50 shadow-md">
    <div class="max-w-screen-lg mx-auto flex justify-between items-center px-4">

      <!-- Marca -->
      <div class="flex items-center gap-2">
        <LucideIcon :name="ICONS.book" size="24" class="text-[#E4B95B]" />
        <span class="text-lg sm:text-xl font-bold">Agenda&nbsp;Academia</span>
      </div>

      <!-- Avatar y menú -->
      <div class="relative">
        <button @click="$emit('toggleProfileDropdown')" class="focus:outline-none">
          <img :src="user.profileImage" alt="avatar" class="w-8 h-8 rounded-full object-cover" />
        </button>

        <div
            v-if="showProfileDropdown"
            class="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50"
        >
          <!-- Cabecera del menú -->
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-medium">{{ user.name }}</p>
            <p class="text-xs text-gray-500">{{ user.role }}</p>
          </div>

          <!-- Opciones -->
          <a class="dropdown-item" @click.prevent="$emit('openModal', 'viewProfile')">
            <LucideIcon :name="ICONS.user"   size="16" class="icon" />
            Perfil
          </a>

          <a class="dropdown-item" @click.prevent="$emit('openModal', 'editProfile')">
            <LucideIcon :name="ICONS.pencil" size="16" class="icon" />
            Editar información
          </a>

          <a class="dropdown-item" @click.prevent="$emit('openModal', 'security')">
            <LucideIcon :name="ICONS.lock"   size="16" class="icon" />
            Seguridad
          </a>

          <div class="border-t border-gray-100"></div>

          <a class="dropdown-item text-red-500" @click.prevent="$emit('logout')">
            <LucideIcon :name="ICONS.logOut" size="16" class="icon" />
            Cerrar sesión
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.dropdown-item { @apply flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer; }
.icon          { @apply w-4 h-4 text-[#E4B95B]; }
</style>
