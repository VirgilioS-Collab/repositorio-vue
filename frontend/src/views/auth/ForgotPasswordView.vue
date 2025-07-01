<script setup lang="ts">
/**
 * @file src/views/auth/ForgotPasswordView.vue
 * @description Vista para que el usuario solicite un enlace de restablecimiento de contraseña.
 * - REFACTORIZADO: Llama directamente a AuthDao en lugar de a un store.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthDao from '@/services/dao/AuthDao' // Cambio clave: se usa el DAO

// --- SECCIÓN DE CONSTANTES ---
const email = ref('')
const isLoading = ref(false) // Cambio: el estado de carga ahora es local.
const emailSent = ref(false)

// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Llama al DAO para solicitar el enlace de recuperación de contraseña.
 * Esta función es asíncrona y gestiona el estado de carga y el mensaje
 * de confirmación para el usuario.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la solicitud se completa.
 * @effects Establece `isLoading` a `true` durante la operación y a `false` al finalizar.
 * Siempre establece `emailSent` a `true` por motivos de seguridad, sin importar el éxito real,
 * para evitar la enumeración de correos electrónicos.
 */
async function handleSubmit(): Promise<void> {
  if (!email.value || isLoading.value) return
  
  isLoading.value = true;
  try {
    // Cambio clave: se llama al método del DAO.
    await AuthDao.forgotPassword({ email: email.value })
  } catch (err) {
    // La falla es silenciosa para el usuario para no revelar si un email existe o no.
    console.error("Forgot password error:", err)
  } finally {
    isLoading.value = false;
    // Por seguridad, siempre se muestra el mensaje de éxito.
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
                :disabled="!email || isLoading"
                class="px-5 py-2.5 rounded-lg text-primary font-bold bg-accent hover:opacity-90 transition"
                :class="{ 'opacity-50 cursor-not-allowed': !email || isLoading }"
              >
                <span v-if="!isLoading">Enviar enlace</span>
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