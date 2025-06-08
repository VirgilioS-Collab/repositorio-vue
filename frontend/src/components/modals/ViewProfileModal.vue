<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/useUserStore'
import LucideIcon from '@/components/ui/LucideIcon.vue'
import { ICONS }  from '@/utils/icons'

const { user } = storeToRefs(useUserStore())
const { closeModal } = useUserStore()
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full mx-4 md:w-3/5 lg:w-2/5">
      <!-- Cabecera -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-bold text-gray-800">Perfil de usuario</h3>
        <button @click="closeModal('viewProfile')" class="text-gray-500 hover:text-gray-700">
          <LucideIcon :name="ICONS.x" size="24" />
        </button>
      </div>

      <!-- Cuerpo -->
      <div class="p-6">
        <div class="flex flex-col items-center mb-6">
          <img :src="user.profileImage" alt="avatar" class="w-20 h-20 rounded-full mb-4 object-cover" />
          <h4 class="text-lg font-semibold">{{ user.name }}</h4>
          <p class="text-gray-600">{{ user.role }}</p>
        </div>

        <h4 class="text-sm font-medium text-gray-500 mb-2">INFORMACIÓN PERSONAL</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><p class="text-xs text-gray-500">Nombre</p><p>{{ user.name }}</p></div>
          <div><p class="text-xs text-gray-500">Correo</p><p>{{ user.email }}</p></div>
          <div><p class="text-xs text-gray-500">Carrera</p><p>{{ user.career }}</p></div>
          <div><p class="text-xs text-gray-500">Facultad</p><p>Ingeniería de Sistemas</p></div>
        </div>
      </div>

      <!-- Pie -->
      <div class="p-4 border-t text-right">
        <button @click="closeModal('viewProfile')"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700">Cerrar</button>
      </div>
    </div>
  </div>
</template>
