// frontend/src/components/modals/ForgotPasswordModal.vue

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'; // Importa el componente Card
import BaseButton from '@/components/ui/BaseButton.vue';
// import BaseInput from '@/components/ui/BaseInput.vue'; // Opcional: si quieres usar BaseInput aquí

const emit = defineEmits<{ (e:'close'):void }>()
const email = ref('')
const loading = ref(false)

// La lógica de envío ya debería usar AuthDao, no http directamente.
// Si aún no lo hace, deberíamos ajustar esto en un paso posterior si es necesario.
// Por ahora, solo se asume que `send` hace la llamada adecuada.
async function send () {
  if (!email.value) return
  loading.value = true
  try {
    // Aquí debería ir la llamada a AuthDao.forgotPassword
    // await AuthDao.forgotPassword({ email: email.value })
    // Simulando la llamada:
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  finally {
    loading.value = false
    emit('close')
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black bg-opacity-60" @click="emit('close')"></div>

    <Card class="w-full max-w-md mx-4 p-6 relative">
      <h3 class="text-lg font-bold mb-4">Recuperar contraseña</h3>

      <input v-model="email" type="email" placeholder="correo@utp.ac.pa"
             class="block w-full border border-gray-300 rounded-md shadow-sm p-2.5 transition-shadow duration-150 focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 w-full mb-6"/>

      <div class="flex justify-end gap-3">
        <BaseButton @click="emit('close')" variant="secondary">Cancelar</BaseButton>
        <BaseButton @click="send" :disabled="!email || loading" :loading="loading">
          Enviar enlace
        </BaseButton>
      </div>
    </Card>
  </div>
</template>

