<script setup lang="ts">
import { ref, computed, onUnmounted, onDeactivated } from 'vue';
import { useRouter, RouterLink, onBeforeRouteLeave } from 'vue-router';
import { useAuthStore } from '@/store/useAuthStore';


const emit = defineEmits<{ (e: 'logged'): void }>();


const email = ref('');
const password = ref('');
const showPwd = ref(false);
const auth = useAuthStore();
const router = useRouter();

const emailValid = computed(() => /.+@.+\..+/.test(email.value));
const formOk = computed(() => !!email.value && emailValid.value && !!password.value && !auth.loading);

function resetFormAndError() {
  email.value = '';
  password.value = '';
  showPwd.value = false;

  try {
    (auth as any).error = null;
  } catch (e) {
  }
}

onBeforeRouteLeave((to, from, next) => {
  resetFormAndError();
  next();
});

onDeactivated(() => {
  resetFormAndError();
});

onUnmounted(() => {
  resetFormAndError();
});

// --- SUBMIT ---
async function submit(): Promise<void> {
  if (!formOk.value) return;
  await auth.login({ email: email.value, password: password.value });
  if (auth.isAuthenticated) emit('logged');
}
</script>

<template>
  <div class="w-full">
      <h2 class="text-2xl sm:text-3xl font-bold text-center text-darkText mb-6">Iniciar Sesión</h2>
      <form @submit.prevent="submit" class="space-y-4">
        <input
            v-model="email"
            type="email"
            placeholder="Correo electrónico o usuario"
            autocomplete="username"
            class="input-focus-effect w-full py-2.5 px-3 text-base" 
            :class="{ 'border-red-500': email.length > 0 && !emailValid }" />
        <p v-if="email.length > 0 && !emailValid" class="text-xs text-red-500 -mt-2">
          Por favor, introduce un correo electrónico válido.
        </p>

        <input
            v-model="password"
            :type="showPwd ? 'text' : 'password'"
            placeholder="Contraseña"
            autocomplete="current-password"
            class="input-focus-effect w-full py-2.5 px-3 text-base" />

        <button
            type="submit"
            :disabled="!formOk"
            class="w-full py-3 rounded-lg text-white font-bold bg-primary hover:opacity-90 transition"
            :class="{ 'opacity-50 cursor-not-allowed': !formOk }">
          <span v-if="!auth.loading">Iniciar sesión</span>
          <span v-else>Procesando…</span>
        </button>

        <RouterLink
            :to="{ name: 'ForgotPassword' }"
            class="block w-full text-center text-sm font-medium text-primary hover:underline py-2">
          ¿Olvidaste tu contraseña?
        </RouterLink>

        <div class="border-t border-gray-200 my-2"></div>

        <RouterLink
            :to="{ name: 'Register' }"
            :class="{ 'opacity-50 pointer-events-none': auth.loading }"
            class="btn-accent w-auto mx-auto block mt-4">
          Crear cuenta nueva
        </RouterLink>
      </form>
      <p v-if="auth.error" class="text-sm text-red-500 text-center mt-4">{{ auth.error }}</p>
  </div>
</template>