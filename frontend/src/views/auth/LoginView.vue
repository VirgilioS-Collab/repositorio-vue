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
import { useRouter } from 'vue-router'
import LoginForm from '@/views/auth/LoginForm.vue'
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'
import { useAuthStore } from '@/store/useAuthStore.ts'

// --- Lógica del componente (sin cambios) ---
const router = useRouter()
const auth = useAuthStore()
const showForgot = ref(false)

function onUserLoggedIn(): void {
  if (auth.isAuthenticated) router.push('/')
}

function onForgotPassword(): void {
  showForgot.value = true
}

function onCloseForgotPasswordModal(): void {
  showForgot.value = false
}
</script>

<template>
  <main class="bg-soft min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-screen-xl bg-card rounded-2xl shadow-2xl flex overflow-hidden my-8">
      
      <div class="hidden lg:flex w-1/2 p-12 flex-col justify-center items-start">
        <h1 class="text-6xl font-bold text-primary">
          Agenda Académica
        </h1>
        <p class="text-2xl mt-4 text-darkText leading-tight">
          La plataforma para organizar y participar en la vida estudiantil de la UTP.
        </p>
      </div>

      <div class="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-gray-50/50">
        <LoginForm
            @logged="onUserLoggedIn"
            @forgot="onForgotPassword"
        />
        <p class="text-center text-sm text-gray-600 mt-6">
          <b>Crea una página</b> para un club, grupo de estudio o comunidad.
        </p>
      </div>
    </div>
  </main>

  <Teleport to="body">
    <ForgotPasswordModal v-if="showForgot" @close="onCloseForgotPasswordModal" />
    <LoadingOverlay v-if="auth.loading" />
  </Teleport>
</template>