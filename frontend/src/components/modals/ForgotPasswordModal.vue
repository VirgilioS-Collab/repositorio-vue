// frontend/src/components/modals/ForgotPasswordModal.vue

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'; // Importa el componente Card
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
             class="input-focus-effect w-full mb-6"/>

      <div class="flex justify-end gap-3">
        <button class="btn" @click="emit('close')">Cancelar</button>
        <button class="btn-primary" @click="send" :disabled="!email || loading">
          <span v-if="!loading">Enviar enlace</span>
          <span v-else class="flex items-center"><i class="fas fa-spinner fa-spin mr-2" /> Enviando…</span>
        </button>
      </div>
    </Card>
  </div>
</template>

