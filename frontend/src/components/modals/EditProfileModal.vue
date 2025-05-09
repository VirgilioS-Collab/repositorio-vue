<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { useUserStore } from '@/store/useUserStore'
import LucideIcon  from '@/components/ui/LucideIcon.vue'
import BaseInput   from '@/components/ui/BaseInput.vue'
import { ICONS }   from '@/utils/icons'

const store = useUserStore()
const { user } = storeToRefs(store)

/* formulario editable */
const form = reactive({ name: '', email: '', career: '' })
Object.assign(form, user.value)

function save () {
  Object.assign(user.value, form)
  store.closeModal('editProfile')
  store.showToast('Información actualizada')
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full mx-4 md:w-3/5 lg:w-2/5">
      <!-- Cabecera -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-bold">Editar información personal</h3>
        <button @click="store.closeModal('editProfile')" class="text-gray-500 hover:text-gray-700">
          <LucideIcon :name="ICONS.x" size="24" />
        </button>
      </div>

      <!-- Cuerpo -->
      <div class="p-6 space-y-4">
        <BaseInput label="Nombre completo"    v-model="form.name" />
        <BaseInput label="Correo electrónico" v-model="form.email" type="email" />
        <BaseInput label="Carrera"            v-model="form.career" />
      </div>

      <!-- Pie -->
      <div class="p-4 border-t flex justify-end gap-3">
        <button @click="store.closeModal('editProfile')" class="btn">Cancelar</button>
        <button @click="save" class="btn-primary">Guardar cambios</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn { @apply px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200; }
.btn-primary { @apply px-4 py-2 rounded-md bg-accent text-primary hover:bg-yellow-500; }
</style>
