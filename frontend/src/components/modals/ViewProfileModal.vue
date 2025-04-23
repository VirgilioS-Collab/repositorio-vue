<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full mx-4 md:w-3/5 lg:w-2/5">
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-bold text-gray-800">Perfil de Usuario</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <XIcon />
        </button>
      </div>

      <div class="p-6">
        <div class="flex flex-col items-center mb-6">
          <div class="w-20 h-20 rounded-full bg-gray-200 mb-4 overflow-hidden">
            <img :src="user.profileImage" alt="Profile" class="w-full h-full object-cover" />
          </div>
          <h4 class="text-lg font-semibold">{{ user.name }}</h4>
          <p class="text-gray-600">{{ user.role }}</p>
        </div>

        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">INFORMACIÓN PERSONAL</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500">Nombre completo</p>
                <p class="text-gray-800">{{ user.name }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Correo electrónico</p>
                <p class="text-gray-800">{{ user.email }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Carrera</p>
                <p class="text-gray-800">{{ user.career }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Facultad</p>
                <p class="text-gray-800">Ingeniería de Sistemas Computacionales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 border-t flex justify-end">
        <button @click="$emit('close')" class="px-4 py-2 bg-[#00205B] text-white rounded-md hover:bg-blue-700 transition">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { XIcon } from 'lucide-vue-next'

defineProps({
  user: Object
})

defineEmits(['close'])
</script>
