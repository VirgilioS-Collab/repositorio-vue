<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/useUserStore'

import LucideIcon from '@/components/ui/LucideIcon.vue'
import { ICONS }   from '@/utils/icons'

const store = useUserStore()
const { user, showProfileDropdown } = storeToRefs(store)
const { toggleProfileDropdown, openModal, logout } = store
</script>

<template>
  <nav class="bg-[#00205B] text-white p-4 fixed inset-x-0 top-0 z-50 shadow-md">
    <div class="max-w-screen-lg mx-auto flex justify-between items-center px-4">
      <!-- Marca -->
      <div class="flex items-center gap-2">
        <!-- aquí puedes dejar :name="ICONS.book" porque 'book' está en IconKey -->
        <LucideIcon :name="ICONS.book" size="24" class="text-[#E4B95B]" />
        <span class="text-lg sm:text-xl font-bold">Agenda&nbsp;Academia</span>
      </div>

      <!-- Avatar y menú -->
      <div class="relative">
        <button @click="toggleProfileDropdown" class="focus:outline-none">
          <img :src="user.profileImage" alt="avatar" class="w-8 h-8 rounded-full object-cover" />
        </button>

        <div v-if="showProfileDropdown"
             class="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
          <!-- Cabecera del menú -->
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-medium">{{ user.name }}</p>
            <p class="text-xs text-gray-500">{{ user.role }}</p>
          </div>

          <!-- Opciones -->
          <a class="dropdown-item" @click.prevent="openModal('viewProfile')">
            <!-- user está en IconKey, no hay error -->
            <LucideIcon name="user" size="16" class="icon" /> Perfil
          </a>
          <a class="dropdown-item" @click.prevent="openModal('editProfile')">
            <LucideIcon name="pencil" size="16" class="icon" /> Editar información
          </a>
          <a class="dropdown-item" @click.prevent="openModal('security')">
            <LucideIcon name="lock" size="16" class="icon" /> Seguridad
          </a>

          <div class="border-t border-gray-100"></div>

          <!-- aquí ya no usamos :name ni ICONS, sino la clave logout -->
          <a class="dropdown-item text-red-500" @click.prevent="logout">
            <LucideIcon name="logout" size="16" class="icon" /> Cerrar sesión
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
