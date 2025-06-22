<script setup lang="ts">
/**
 * @file src/views/auth/ResetPasswordView.vue
 * @description Vista para que el usuario establezca una nueva contraseña
 * utilizando el token recibido por correo electrónico.
 */
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

// --- SECCIÓN DE PROPS ---
/**
 * @docstring
 * Se utiliza defineProps para recibir el token directamente desde la URL
 * como un prop. Esto es posible gracias a la opción `props: true` que
 * configuramos en el archivo del enrutador.
 */
const props = defineProps<{
  token: string
}>()

// --- SECCIÓN DE ESTADO Y CONSTANTES ---
const authStore = useAuthStore()
const router = useRouter()
const newPassword = ref('')
const confirmPassword = ref('')
const passwordReset = ref(false)

// --- SECCIÓN DE PROPIEDADES COMPUTADAS ---
/**
 * @docstring
 * Propiedad computada para validar que ambas contraseñas coinciden
 * y no están vacías. Es crucial para habilitar el botón de envío.
 */
const passwordsMatch = computed(() => {
  return newPassword.value.length > 0 && newPassword.value === confirmPassword.value
})

// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Gestiona el envío del formulario. Llama a la acción `resetPassword`
 * del store, pasando el token (recibido como prop) y la nueva contraseña.
 * Si tiene éxito, muestra un mensaje de confirmación.
 */
async function handleSubmit(): Promise<void> {
  if (!passwordsMatch.value || authStore.loading) return

  const success = await authStore.resetPassword(props.token, newPassword.value)
  if (success) {
    passwordReset.value = true
  }
}
</script>

<template>
  <main class="bg-soft min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-card rounded-2xl shadow-xl p-8">
        
        <div v-if="!passwordReset">
          <h2 class="text-2xl font-bold text-darkText">Establecer Nueva Contraseña</h2>
          <p class="text-gray-600 mt-2 mb-6">
            Por favor, introduce tu nueva contraseña a continuación.
          </p>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <input
              v-model="newPassword"
              type="password"
              required
              placeholder="Nueva contraseña"
              class="input-focus-effect w-full"
            />
            <input
              v-model="confirmPassword"
              type="password"
              required
              placeholder="Confirmar nueva contraseña"
              class="input-focus-effect w-full"
              :class="{ 'border-red-500': confirmPassword && !passwordsMatch }"
            />
             <p v-if="confirmPassword && !passwordsMatch" class="text-xs text-red-500 -mt-2">
              Las contraseñas no coinciden.
            </p>

            <div class="flex items-center justify-end gap-3 pt-4">
              <RouterLink :to="{ name: 'Login' }" class="px-5 py-2.5 rounded-lg border hover:bg-gray-100">
                Cancelar
              </RouterLink>
              <button
                type="submit"
                :disabled="!passwordsMatch || authStore.loading"
                class="px-5 py-2.5 rounded-lg text-primary font-bold bg-accent hover:opacity-90 transition"
                :class="{ 'opacity-50 cursor-not-allowed': !passwordsMatch || authStore.loading }"
              >
                <span v-if="!authStore.loading">Guardar Contraseña</span>
                <span v-else>Guardando...</span>
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

      </div>
    </div>
  </main>
</template>