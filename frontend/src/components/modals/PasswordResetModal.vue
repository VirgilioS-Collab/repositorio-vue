// frontend/src/components/modals/PasswordResetModal.vue

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'; // Importa el componente Card
import BaseButton from '@/components/ui/BaseButton.vue';

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
               class="block w-full border border-gray-300 rounded-md shadow-sm p-2.5 transition-shadow duration-150 focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 w-full mb-6"/>

        <div class="flex justify-end gap-3">
          <BaseButton @click="emit('close')" variant="secondary">Cancelar</BaseButton>
          <BaseButton @click="emit('submit', email)">Enviar</BaseButton>
        </div>
      </Card>
    </div>
  </transition>
</template>

