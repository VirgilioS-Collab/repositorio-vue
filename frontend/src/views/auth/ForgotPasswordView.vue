<script setup lang="ts">
/**
 * @file src/views/auth/ForgotPasswordView.vue
 * @description Vista para que el usuario solicite un enlace de
 * restablecimiento de contraseña.
 */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

// --- SECCIÓN DE ESTADO Y CONSTANTES ---
const authStore = useAuthStore()
const email = ref('')
const emailSent = ref(false) // Para mostrar un mensaje de confirmación

/**
 * @docstring
 * Llama a la acción del store para solicitar el enlace.
 * Si tiene éxito, muestra un mensaje de confirmación al usuario.
 */
async function handleSubmit(): Promise<void> {
  if (!email.value || authStore.loading) return
  const success = await authStore.requestPasswordReset(email.value)
  if (success) {
    emailSent.value = true
  }
}
</script>

<template>
  <main class="bg-soft min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-card rounded-2xl shadow-xl p-8">
        
        <div v-if="!emailSent">
          <h2 class="text-2xl font-bold text-darkText">Recuperar Contraseña</h2>
          <p class="text-gray-600 mt-2 mb-6">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <input
              v-model="email"
              type="email"
              required
              placeholder="correo@utp.ac.pa"
              class="input-focus-effect w-full"
            />
            <div class="flex items-center justify-end gap-3 pt-4">
              <RouterLink :to="{ name: 'Login' }" class="px-5 py-2.5 rounded-lg border hover:bg-gray-100">
                Cancelar
              </RouterLink>
              <button
                type="submit"
                :disabled="!email || authStore.loading"
                class="px-5 py-2.5 rounded-lg text-primary font-bold bg-accent hover:opacity-90 transition"
                :class="{ 'opacity-50 cursor-not-allowed': !email || authStore.loading }"
              >
                <span v-if="!authStore.loading">Enviar enlace</span>
                <span v-else>Enviando...</span>
              </button>
            </div>
          </form>
        </div>

        <div v-else class="text-center">
          <h2 class="text-2xl font-bold text-darkText">Revisa tu Correo</h2>
          <p class="text-gray-600 mt-4 mb-6">
            Si una cuenta con el correo <strong>{{ email }}</strong> existe, hemos enviado un enlace para restablecer tu contraseña.
          </p>
          <RouterLink
            :to="{ name: 'Login' }"
            class="w-full block py-3 rounded-lg text-white font-bold bg-primary hover:opacity-90 transition"
          >
            Volver a Iniciar Sesión
          </RouterLink>
        </div>

      </div>
    </div>
  </main>
</template>