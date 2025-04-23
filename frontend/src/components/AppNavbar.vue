<script setup lang="ts">
import { BookIcon, UserIcon, EditIcon, LockIcon, LogOutIcon } from 'lucide-vue-next'

defineProps({
  user: {
    type: Object,
    required: true
  },
  showProfileDropdown: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggleProfileDropdown', 'openModal', 'logout'])
</script>

<template>
  <nav class="bg-[#00205B] text-white p-4 fixed top-0 left-0 right-0 z-50 shadow-md">
    <div class="max-w-screen-lg mx-auto flex justify-between items-center px-4">
      <div class="flex items-center space-x-2">
        <BookIcon :size="24" color="#E4B95B" />
        <span class="text-lg sm:text-xl font-bold">Agenda Academia</span>
      </div>

      <div class="relative">
        <button @click="$emit('toggleProfileDropdown')" class="focus:outline-none">
          <img :src="user.profileImage" class="w-8 h-8 rounded-full object-cover" />
        </button>

        <div v-if="showProfileDropdown" class="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-medium">{{ user.name }}</p>
            <p class="text-xs text-gray-500">{{ user.role }}</p>
          </div>

          <a @click.prevent="$emit('openModal', 'viewProfile')" class="dropdown-item">
            <UserIcon class="icon" /> Perfil
          </a>

          <a @click.prevent="$emit('openModal', 'editProfile')" class="dropdown-item">
            <EditIcon class="icon" /> Editar Información
          </a>

          <a @click.prevent="$emit('openModal', 'security')" class="dropdown-item">
            <LockIcon class="icon" /> Seguridad
          </a>

          <div class="border-t border-gray-100"></div>

          <a @click.prevent="$emit('logout')" class="dropdown-item text-red-500">
            <LogOutIcon class="icon" /> Cerrar sesión
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.dropdown-item {
  @apply flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer gap-2;
}
.icon {
  @apply w-4 h-4 text-[#E4B95B];
}
</style>
