<script setup lang="ts">
/**
 * @file src/views/auth/ForgotPasswordView.vue
 * @description Vista para que el usuario solicite un enlace de restablecimiento de contraseña.
 * - REFACTORIZADO: Llama directamente a AuthDao en lugar de a un store.
 * - INTEGRADO: Usa `StateRenderer` para manejar estados de carga/error y `Card` para el layout.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthDao from '@/services/dao/AuthDao'
import StateRenderer from '@/components/ui/StateRenderer.vue' // Importar StateRenderer
import Card from '@/components/ui/Card.vue' // Importar Card

// --- SECCIÓN DE CONSTANTES ---
const email = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null) // Para manejar errores locales
const emailSent = ref(false)

// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Llama al DAO para solicitar el enlace de recuperación de contraseña.
 * Gestiona el estado de carga y el mensaje de confirmación/error para el usuario.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la solicitud se completa.
 * @effects Establece `isLoading` a `true` durante la operación y a `false` al finalizar.
 * Actualiza `error` si hay un problema y siempre establece `emailSent` a `true` por seguridad.
 */
async function handleSubmit(): Promise<void> {
  if (!email.value || isLoading.value) return
  
  isLoading.value = true;
  error.value = null; // Limpiar errores previos
  try {
    await AuthDao.forgotPassword({ email: email.value })
  } catch (err: any) {
    // La falla es silenciosa para el usuario para no revelar si un email existe o no.
    console.error("Forgot password error:", err)
    // Opcional: mostrar un error más genérico si la API devuelve un mensaje útil
    // error.value = err.response?.data?.message || 'Error al enviar la solicitud.'; 
  } finally {
    isLoading.value = false;
    // Por seguridad, siempre se muestra el mensaje de éxito,
    // incluso si el correo no existía para evitar enumeración.
    emailSent.value = true
  }
}
</script>

<template>
  <main class="bg-soft min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <Card class="p-8"> <StateRenderer :loading="isLoading" :error="error">
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
                  :disabled="!email || isLoading"
                  class="px-5 py-2.5 rounded-lg text-primary font-bold bg-accent hover:opacity-90 transition"
                  :class="{ 'opacity-50 cursor-not-allowed': !email || isLoading }"
                >
                  <span>Enviar enlace</span>
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
        </StateRenderer>
      </Card>
    </div>
  </main>
</template>