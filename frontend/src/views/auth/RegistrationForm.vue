<script setup lang="ts">
/**
 * @file src/views/auth/RegistrationForm.vue
 * @description Formulario de registro de usuario.
 * - REFACTORIZADO: Ahora llama directamente a AuthDao.register() y gestiona
 * su propio estado de carga y error, desacoplándose del useAuthStore.
 */

import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AuthDao from '@/services/dao/AuthDao' 
import type { UserEnrollDTO } from '@/services/dao/models/Auth' 

const emit = defineEmits<{ (e: 'registered'): void }>()

// El estado de carga y error ahora es local al componente.
const isLoading = ref(false) 
const error = ref<string | null>(null)
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
 * @returns {boolean} `true` si el email es válido, `false` en caso contrario.
 */
const emailOk = computed(() => /^[A-Za-z0-9._%+-]+@utp\.ac\.pa$/i.test(form.value.email))

/**
 * @docstring
 * Valida que las contraseñas coincidan y no estén vacías.
 * @returns {boolean} `true` si las contraseñas coinciden y no están vacías, `false` en caso contrario.
 */
const pwdOk = computed(() => form.value.password.length > 0 && form.value.password === form.value.confirmPassword)

/**
 * @docstring
 * Realiza una validación simple para habilitar el botón de envío,
 * asegurando que los campos clave estén completos y las validaciones pasen.
 * @returns {boolean} `true` si el formulario es válido y está listo para enviar, `false` en caso contrario.
 */
const isFormComplete = computed(() => {
    return form.value.firstName && form.value.lastName && form.value.username && emailOk.value && pwdOk.value
})

// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Gestiona el envío del formulario de registro.
 * Construye el objeto DTO (Data Transfer Object) con los datos del formulario
 * y llama directamente al método `register` del `AuthDao`.
 * Maneja el estado de carga y cualquier error que pueda ocurrir durante el proceso.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el registro se completa.
 * @effects Establece `isLoading` a `true` durante la operación y a `false` al finalizar.
 * Actualiza el estado `error` en caso de fallo o emite el evento 'registered' en caso de éxito.
 * @throws {Error} Si la operación de registro falla en el DAO.
 */
async function submit(): Promise<void> {
  if (!isFormComplete.value || isLoading.value) return
  
  isLoading.value = true
  error.value = null
  
  try {
    // 1. Construimos el payload con el tipado estricto de UserEnrollDTO
    const payload: UserEnrollDTO = {
      first_name: form.value.firstName,
      last_name:  form.value.lastName,
      // Asegurarse de que birth_date sea una cadena ISO 8601
      birth_date: new Date(form.value.birthDate).toISOString().split('T')[0], // Formato YYYY-MM-DD
      gender:     form.value.gender,
      doc_type:   form.value.docType,
      doc_number: form.value.docNumber,
      phone:      form.value.phone,
      username:   form.value.username,
      email:      form.value.email,
      password:   form.value.password,
    };
    
    // 2. Llamamos directamente al método del DAO
    await AuthDao.register(payload)
    
    // 3. Notificamos al componente padre del éxito
    emit('registered')

  } catch (err: any) {
    // Si hay un error, intentamos obtener el mensaje del backend o un mensaje genérico.
    error.value = err.response?.data?.message ?? 'No se pudo completar el registro. Inténtalo de nuevo.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <header class="text-center mb-6">
      <h2 class="text-2xl sm:text-3xl font-bold text-darkText">Crear una Cuenta</h2>
      <p class="text-gray-600 mt-1">
        ¿Ya tienes una? 
        <RouterLink :to="{ name: 'Login' }" class="font-medium text-primary hover:underline">
          Inicia sesión
        </RouterLink>
      </p>
    </header>

    <form @submit.prevent="submit" class="space-y-6">
      <div>
        <h3 class="text-base sm:text-lg font-semibold text-gray-500 border-b-2 border-accent pb-2 mb-4">DATOS PERSONALES</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <input v-model="form.firstName" required placeholder="Nombre" autocomplete="given-name" class="input-focus-effect w-full py-2.5 px-3" />
            <input v-model="form.lastName" required placeholder="Apellido" autocomplete="family-name" class="input-focus-effect w-full py-2.5 px-3" />
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <input v-model="form.birthDate" required type="date" placeholder="Fecha de Nacimiento" autocomplete="bday" class="input-focus-effect w-full py-2.5 px-3" />
            <select v-model="form.gender" autocomplete="sex" class="input-focus-effect w-full py-2.5 px-3">
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-base sm:text-lg font-semibold text-gray-500 border-b-2 border-accent pb-2 mb-4">IDENTIFICACIÓN Y CONTACTO</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <select v-model="form.docType" class="input-focus-effect sm:w-1/3 py-2.5 px-3">
              <option>Cédula</option>
              <option>Pasaporte</option>
              <option>Carné Residente</option>
            </select>
            <input v-model="form.docNumber" required placeholder="N.º de documento" autocomplete="off" class="input-focus-effect sm:w-2/3 py-2.5 px-3" />
          </div>
          <input v-model="form.phone" required placeholder="Teléfono (+507...)" autocomplete="tel" class="input-focus-effect w-full py-2.5 px-3" />
        </div>
      </div>

      <div>
        <h3 class="text-base sm:text-lg font-semibold text-gray-500 border-b-2 border-accent pb-2 mb-4">CREDENCIALES DE LA CUENTA</h3>
        <div class="space-y-4">
          <input v-model="form.username" required placeholder="Nombre de usuario" autocomplete="username" class="input-focus-effect w-full py-2.5 px-3" />
          <input v-model="form.email" required placeholder="correo@utp.ac.pa" autocomplete="email" class="input-focus-effect w-full py-2.5 px-3" :class="{ 'border-red-500': form.email && !emailOk }" />
           <p v-if="form.email && !emailOk" class="text-xs text-red-500 -mt-2">
              El correo debe ser institucional (@utp.ac.pa).
            </p>
          <input v-model="form.password" required type="password" placeholder="Contraseña" autocomplete="new-password" class="input-focus-effect w-full py-2.5 px-3" />
          <input v-model="form.confirmPassword" required type="password" placeholder="Confirmar contraseña" autocomplete="new-password" class="input-focus-effect w-full py-2.5 px-3" :class="{ 'border-red-500': form.confirmPassword && !pwdOk }" />
          <p v-if="form.confirmPassword && !pwdOk" class="text-xs text-red-500 -mt-2">
            Las contraseñas no coinciden.
          </p>
        </div>
      </div>

      <div class="pt-4 flex flex-col items-center gap-3">
        <button
          type="submit"
          :disabled="!isFormComplete || isLoading"
          class="w-full sm:w-3/4 py-3 rounded-lg text-white font-bold bg-primary hover:opacity-90 transition"
          :class="{ 'opacity-50 cursor-not-allowed': !isFormComplete || isLoading }"
        >
          <span v-if="!isLoading">Registrarme</span>
          <span v-else>Procesando…</span>
        </button>
      </div>
       <p v-if="error" class="text-sm text-red-500 text-center mt-4">{{ error }}</p>
    </form>
  </div>
</template>