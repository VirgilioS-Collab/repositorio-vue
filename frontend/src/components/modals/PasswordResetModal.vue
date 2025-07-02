// frontend/src/components/modals/PasswordResetModal.vue

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'; // Importa el componente Card

const props = defineProps<{ show:boolean }>()
const emit  = defineEmits<{ (e:'close'):void; (e:'submit', email:string):void }>()
const email = ref('') // Este `email` probablemente no sea necesario aquí, si este modal es para el `reset`, no para `forgot`.
                      // Si este modal es efectivamente para "recuperar contraseña" y no "restablecer contraseña",
                      // entonces es un duplicado de ForgotPasswordModal.vue y uno de los dos debería eliminarse.
                      // Asumo que este es un modal que se activa para una acción, no una vista de ruta.
</script>

<template>
  <transition name="slide-fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-60" @click="emit('close')"></div>

      <Card class="w-full max-w-md mx-4 p-6 relative">
        <h3 class="text-lg font-bold mb-4">Restablecer contraseña</h3>

        <input v-model="email" type="email" placeholder="correo@utp.ac.pa"
               class="input-focus-effect w-full mb-6"/>

        <div class="flex justify-end gap-3">
          <button class="btn" @click="emit('close')">Cancelar</button>
          <button class="btn-primary" @click="emit('submit', email)">Enviar</button>
        </div>
      </Card>
    </div>
  </transition>
</template>

<style scoped>
/* Eliminar estilos locales de botones si ya están en style.css o se usan clases de Tailwind/nuevas globales */
/* .btn { @apply px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200; } */
/* .btn-primary { @apply px-4 py-2 rounded-md bg-accent text-primary hover:bg-yellow-500; } */
/* Si usas las clases globales de style.css, estos estilos scoped ya no serían necesarios aquí. */
</style>