<script setup lang="ts">
/**
 * @file src/views/auth/ResetPasswordView.vue
 * @description Vista para establecer una nueva contraseña.
 * - REFACTORIZADO: Llama directamente a AuthDao.
 * - INTEGRADO: Usa `StateRenderer` para manejar estados de carga/error y `Card` para el layout.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { ref, computed } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import AuthDao from '@/services/dao/AuthDao'
import type { PasswordResetPayload } from '@/services/dao/models/Auth'
import StateRenderer from '@/components/ui/StateRenderer.vue' // Importar StateRenderer
import Card from '@/components/ui/Card.vue' // Importar Card

// --- SECCIÓN DE CONSTANTES ---
const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const error = ref<string | null>(null)
const passwordReset = ref(false)
const form = ref({
  newPassword: '',
  confirmPassword: ''
});

// --- SECCIÓN DE PROPIEDADES COMPUTADAS ---
/**
 * @docstring
 * Propiedad computada que verifica si las contraseñas ingresadas coinciden
 * y no están vacías.
 * @returns {boolean} `true` si las contraseñas coinciden y tienen contenido, `false` en caso contrario.
 */
const passwordsMatch = computed(() => {
  return form.value.newPassword.length > 0 && form.value.newPassword === form.value.confirmPassword
})

// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Gestiona el envío del formulario para restablecer la contraseña.
 * Extrae el token y el email de la URL y llama al DAO para realizar el restablecimiento.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el restablecimiento se completa.
 * @effects Establece `isLoading` a `true` durante la operación y a `false` al finalizar.
 * Actualiza el estado `error` en caso de fallo o `passwordReset` en caso de éxito.
 */
async function handleSubmit(): Promise<void> {
  if (!passwordsMatch.value || isLoading.value) return

  isLoading.value = true;
  error.value = null;

  try {
    const verification_code = route.query.token as string
    const email = route.query.email as string
    
    if (!verification_code || !email) {
      // Lanzar un error que será capturado por el catch y mostrado por StateRenderer
      throw new Error('Faltan parámetros de verificación en la URL.');
    }

    const payload: PasswordResetPayload = {
      email: email,
      verification_code: verification_code,
      new_password: form.value.newPassword
    }

    await AuthDao.resetPassword(payload)
    passwordReset.value = true

  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'No se pudo actualizar la contraseña.'
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main class="bg-soft min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <Card class="p-8"> <StateRenderer :loading="isLoading" :error="error">
          <div v-if="!passwordReset">
            <h2 class="text-2xl font-bold text-darkText">Establecer Nueva Contraseña</h2>
            <p class="text-gray-600 mt-2 mb-6">
              Por favor, introduce tu nueva contraseña a continuación.
            </p>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <input
                v-model="form.newPassword"
                type="password"
                required
                placeholder="Nueva contraseña"
                class="input-focus-effect w-full"
              />
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                placeholder="Confirmar nueva contraseña"
                class="input-focus-effect w-full"
                :class="{ 'border-red-500': form.confirmPassword && !passwordsMatch }"
              />
              <p v-if="form.confirmPassword && !passwordsMatch" class="text-xs text-red-500 -mt-2">
                Las contraseñas no coinciden.
              </p>

              <div class="flex items-center justify-end gap-3 pt-4">
                <RouterLink :to="{ name: 'Login' }" class="px-5 py-2.5 rounded-lg border hover:bg-gray-100">
                  Cancelar
                </RouterLink>
                <button
                  type="submit"
                  :disabled="!passwordsMatch || isLoading"
                  class="px-5 py-2.5 rounded-lg text-primary font-bold bg-accent hover:opacity-90 transition"
                  :class="{ 'opacity-50 cursor-not-allowed': !passwordsMatch || isLoading }"
                >
                  <span>Guardar Contraseña</span>
                </button>
              </div>
            </form>
          </div>

          <div v-else class="text-center">
            <h2 class="text-2xl font-bold text-darkText">¡Contraseña Actualizada!</h2>
            <p class="text-gray-600 mt-4 mb-6">
              Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.
            </p>
            <RouterLink
              :to="{ name: 'Login' }"
              class="w-full block py-3 rounded-lg text-white font-bold bg-primary hover:opacity-90 transition"
            >
              Ir a Iniciar Sesión
            </RouterLink>
          </div>
        </StateRenderer>
      </Card>
    </div>
  </main>
</template>