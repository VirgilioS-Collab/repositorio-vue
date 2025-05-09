<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ show:boolean }>()
const emit  = defineEmits<{ (e:'close'):void; (e:'submit', email:string):void }>()
const email = ref('')
</script>

<template>
  <transition name="slide-fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-60" @click="emit('close')"></div>

      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative">
        <h3 class="text-lg font-bold mb-4">Restablecer contraseña</h3>

        <input v-model="email" type="email" placeholder="correo@utp.ac.pa"
               class="w-full border rounded-md px-3 py-2 mb-6 focus:ring-accent"/>

        <div class="flex justify-end gap-3">
          <button class="btn" @click="emit('close')">Cancelar</button>
          <button class="btn-primary" @click="emit('submit', email)">Enviar</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.btn { @apply px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200; }
.btn-primary { @apply px-4 py-2 rounded-md bg-accent text-primary hover:bg-yellow-500; }
</style>
