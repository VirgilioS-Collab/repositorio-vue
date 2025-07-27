<script setup lang="ts">
/**
 * @file src/views/auth/LoginView.vue
 * @description Vista principal para el inicio de sesión.
 * - REFACTORIZADO: Se envuelve todo el contenido en una única
 * tarjeta principal (`div.card-holder`) para crear un efecto
 * flotante con sombra.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoginForm from '@/views/auth/LoginForm.vue'
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'
import { useAuthStore } from '@/store/useAuthStore'
import { PATH_ROOT, NAME_REGISTER } from '@/constants/routes';

// --- SECCIÓN DE CONSTANTES ---
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const showForgot = ref(false)

// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Redirige al usuario después de un inicio de sesión exitoso.
 * Prioriza la redirección a una ruta específica si el usuario
 * intentó acceder a una página protegida antes de iniciar sesión.
 * @effects Redirige al usuario a `redirectPath` o a la página de inicio.
 */
function onUserLoggedIn(): void {
  const redirectPath = (route.query.redirect as string) || PATH_ROOT;
  router.push(redirectPath);
}

/**
 * @docstring
 * Muestra el modal para solicitar el restablecimiento de contraseña.
 * @effects Actualiza el estado `showForgot` a `true`.
 */
function onForgotPassword(): void {
  showForgot.value = true
}

/**
 * @docstring
 * Cierra el modal de restablecimiento de contraseña.
 * @effects Actualiza el estado `showForgot` a `false`.
 */
function onCloseForgotPasswordModal(): void {
  showForgot.value = false
}
</script>

<template>
  <main class="bg-soft min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-5xl bg-card rounded-2xl shadow-2xl flex overflow-hidden my-8 sm:my-12">
      
      <div class="hidden lg:flex w-1/2 p-8 lg:p-12 flex-col justify-center items-start">
        <img src="@/assets/logo.svg" alt="Logo Agenda Académica" class="h-24 mb-4">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary">
          Agenda Académica
        </h1>
        <p class="text-lg sm:text-xl lg:text-2xl mt-4 text-darkText leading-tight">
          La plataforma para organizar y participar en la vida estudiantil de la UTP.
        </p>
      </div>

      <div class="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-gray-50/50">
        <LoginForm
            @logged="onUserLoggedIn"
            @forgot="onForgotPassword"
        />
        <p class="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta? <RouterLink :to="{ name: NAME_REGISTER }" class="font-semibold text-primary hover:underline">Regístrate aquí</RouterLink>
        </p>
      </div>
    </div>
  </main>

  <Teleport to="body">
    <ForgotPasswordModal v-if="showForgot" @close="onCloseForgotPasswordModal" />
    <LoadingOverlay v-if="auth.loading" />
  </Teleport>
</template>