<script setup lang="ts">
/**
 * @file src/views/auth/RegistrationForm.vue
 * @description Formulario de registro de usuario.
 * - REFACTORIZADO: Se ajusta el layout de los campos para que coincida
 * con la nueva estructura visual de dos columnas en ciertas filas,
 * utilizando flexbox para la organización.
 */
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

// --- SECCIÓN DE EMITS ---
const emit = defineEmits<{ (e: 'registered'): void }>()

// --- SECCIÓN DE CONSTANTES Y ESTADO ---
const auth = useAuthStore()
const router = useRouter()
const form = ref({
  firstName: '',
  lastName: '',
  birthDate: '',
  gender: 'Masculino',
  docType: 'Cédula',
  docNumber: '',
  phone: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// --- SECCIÓN DE PROPIEDADES COMPUTADAS ---
/**
 * @docstring
 * Valida que el correo electrónico tenga el formato institucional.
 */
const emailOk = computed(() => /^[A-Za-z0-9._%+-]+@utp\.ac\.pa$/i.test(form.value.email))

/**
 * @docstring
 * Valida que las contraseñas coincidan y no estén vacías.
 */
const pwdOk = computed(() => form.value.password.length > 0 && form.value.password === form.value.confirmPassword)

/**
 * @docstring
 * Realiza una validación simple para habilitar el botón de envío,
 * asegurando que los campos clave estén completos.
 */
const isFormComplete = computed(() => {
    return form.value.firstName && form.value.lastName && form.value.username && emailOk.value && pwdOk.value
})

// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Gestiona el envío del formulario al store de autenticación.
 */
async function submit(): Promise<void> {
  if (!isFormComplete.value || auth.loading) return
  const wasSuccessful = await auth.userEnroll(form.value)
  if (wasSuccessful) {
    emit('registered')
  }
}
</script>

<template>
  <div class="w-full">
    <header class="text-center mb-6">
      <h2 class="text-3xl font-bold text-darkText">Crear una Cuenta</h2>
      <p class="text-gray-600 mt-1">
        ¿Ya tienes una? 
        <RouterLink :to="{ name: 'Login' }" class="font-medium text-primary hover:underline">
          Inicia sesión
        </RouterLink>
      </p>
    </header>

    <form @submit.prevent="submit" class="space-y-6">
      <div>
        <h3 class="text-base font-semibold text-gray-500 border-b-2 border-accent pb-2 mb-4">DATOS PERSONALES</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <input v-model="form.firstName" required placeholder="Nombre" class="input-focus-effect w-full" />
            <input v-model="form.lastName" required placeholder="Apellido" class="input-focus-effect w-full" />
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <input v-model="form.birthDate" required type="date" placeholder="Fecha de Nacimiento" class="input-focus-effect w-full" />
            <select v-model="form.gender" class="input-focus-effect w-full">
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-base font-semibold text-gray-500 border-b-2 border-accent pb-2 mb-4">IDENTIFICACIÓN Y CONTACTO</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <select v-model="form.docType" class="input-focus-effect sm:w-1/3">
              <option>Cédula</option>
              <option>Pasaporte</option>
              <option>Carné Residente</option>
            </select>
            <input v-model="form.docNumber" required placeholder="N.º de documento" class="input-focus-effect sm:w-2/3" />
          </div>
          <input v-model="form.phone" required placeholder="Teléfono (+507...)" class="input-focus-effect w-full" />
        </div>
      </div>

      <div>
        <h3 class="text-base font-semibold text-gray-500 border-b-2 border-accent pb-2 mb-4">CREDENCIALES DE LA CUENTA</h3>
        <div class="space-y-4">
          <input v-model="form.username" required placeholder="Nombre de usuario" class="input-focus-effect w-full" />
          <input v-model="form.email" required placeholder="correo@utp.ac.pa" class="input-focus-effect w-full" :class="{ 'border-red-500': form.email && !emailOk }" />
           <p v-if="form.email && !emailOk" class="text-xs text-red-500 -mt-2">
              El correo debe ser institucional (@utp.ac.pa).
            </p>
          <input v-model="form.password" required type="password" placeholder="Contraseña" class="input-focus-effect w-full" />
          <input v-model="form.confirmPassword" required type="password" placeholder="Confirmar contraseña" class="input-focus-effect w-full" :class="{ 'border-red-500': form.confirmPassword && !pwdOk }" />
          <p v-if="form.confirmPassword && !pwdOk" class="text-xs text-red-500 -mt-2">
            Las contraseñas no coinciden.
          </p>
        </div>
      </div>

      <div class="pt-4 flex flex-col items-center gap-3">
        <button
          type="submit"
          :disabled="!isFormComplete || auth.loading"
          class="w-full sm:w-3/4 py-3 rounded-lg text-white font-bold bg-primary hover:opacity-90 transition"
          :class="{ 'opacity-50 cursor-not-allowed': !isFormComplete || auth.loading }"
        >
          <span v-if="!auth.loading">Registrarme</span>
          <span v-else>Procesando…</span>
        </button>
      </div>
    </form>
  </div>
</template>