<script setup lang="ts">
/**
 * @file src/views/auth/LoginView.vue
 * @description Vista principal para el inicio de sesión.
 * - CORREGIDO: Se elimina todo el contenido del HomeView que se había
 * añadido por error, dejando solo la lógica de autenticación.
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '@/views/auth/LoginForm.vue';
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal.vue';
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue';
import { useAuthStore } from '@/store/useAuthStore.ts';

const router = useRouter();
const auth = useAuthStore();
const showForgot = ref(false);

function onUserLoggedIn(): void {
  if (auth.isAuthenticated) router.push('/');
}
function onForgotPassword(): void { showForgot.value = true; }
function onCloseForgotPasswordModal(): void { showForgot.value = false; }
</script>

<template>
  <main class="bg-soft min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-screen-xl bg-card rounded-2xl shadow-2xl flex overflow-hidden my-8">
      <div class="hidden lg:flex w-1/2 p-12 flex-col justify-center items-start">
        <h1 class="text-6xl font-bold text-primary">Alianza UTP</h1>
        <p class="text-2xl mt-4 text-darkText leading-tight">La plataforma para organizar y participar en la vida estudiantil.</p>
      </div>
      <div class="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-gray-50/50">
        <LoginForm @logged="onUserLoggedIn" @forgot="onForgotPassword" />
      </div>
    </div>
  </main>

  <Teleport to="body">
    <ForgotPasswordModal v-if="showForgot" @close="onCloseForgotPasswordModal" />
    <LoadingOverlay v-if="auth.loading" />
  </Teleport>
</template>