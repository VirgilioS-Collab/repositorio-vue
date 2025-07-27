<script setup lang="ts">
/**
 * @file src/views/auth/LoginForm.vue
 * @description Formulario de inicio de sesión.
 * - MODIFICADO: Utiliza los colores del tema de Tailwind (primary y accent).
 * - MODIFICADO: Los enlaces de "Olvidé mi contraseña" y "Crear cuenta"
 * ahora usan RouterLink para navegar a sus respectivas páginas dedicadas,
 * desacoplando completamente este componente de otros flujos.
 */
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

// --- SECCIÓN DE EMITS ---
const emit = defineEmits<{ (e: 'logged'): void }>()

// --- SECCIÓN DE CONSTANTES Y ESTADO ---
const email = ref('')
const password = ref('')
const showPwd = ref(false)
const auth = useAuthStore()
const router = useRouter()

// --- SECCIÓN DE PROPIEDADES COMPUTADAS ---
const emailValid = computed(() => /.+@.+\..+/.test(email.value));
const formOk = computed(() => !!email.value && emailValid.value && !!password.value && !auth.loading)

// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Envía las credenciales al store para la autenticación.
 * Si el inicio de sesión es exitoso, emite el evento 'logged'.
 */
async function submit(): Promise<void> {
  if (!formOk.value) return
  await auth.login({ email: email.value, password: password.value })
  if (auth.isAuthenticated) {
    emit('logged')
  }
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

        
      </form>
      <p v-if="auth.error" class="text-sm text-red-500 text-center mt-4">{{ auth.error }}</p>
  </div>
</template>