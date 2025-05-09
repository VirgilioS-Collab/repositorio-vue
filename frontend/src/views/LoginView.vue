<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'
import ValidatedInput from '@/components/ui/ValidatedInput.vue'
import PasswordResetModal from '@/components/modals/PasswordResetModal.vue'

const email    = ref('')
const password = ref('')
const emailErr = ref('')
const passErr  = ref('')
const showReset = ref(false)

const auth   = useAuthStore()
const router = useRouter()

function validateEmail() {
  emailErr.value = !email.value
      ? 'El correo es requerido'
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
          ? ''
          : 'Correo inválido'
}
function validatePassword() {
  passErr.value = !password.value
      ? 'La contraseña es requerida'
      : password.value.length < 8
          ? 'Mínimo 8 caracteres'
          : ''
}
watch(email, validateEmail)
watch(password, validatePassword)

const formOk = computed(() => !emailErr.value && !passErr.value && email.value && password.value)

async function submit() {
  validateEmail(); validatePassword()
  if (!formOk.value) return
  try {
    await auth.login(email.value, password.value)
    router.push({ name:'admin' })
  } catch (e:any) {
    passErr.value = e?.message ?? 'Error'
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="bg-primary h-16 flex items-center px-6 shadow-md">
      <span class="title-font text-white text-xl font-bold">Agenda Académica</span>
    </div>

    <main class="flex-1 flex items-center justify-center p-4 bg-soft">
      <div class="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-primary p-6 flex justify-center">
          <div class="bg-white rounded-full p-3 shadow">
            <i class="fas fa-university text-3xl text-primary"></i>
          </div>
        </div>

        <div class="p-8">
          <h1 class="title-font text-2xl font-bold text-center mb-6">Iniciar sesión</h1>

          <form @submit.prevent="submit" class="space-y-4">
            <ValidatedInput v-model="email" type="email" icon="fas fa-envelope"
                            label="Correo institucional" :error="emailErr"
                            placeholder="usuario@utp.ac.pa"/>
            <ValidatedInput v-model="password" type="password" icon="fas fa-lock"
                            label="Contraseña" :error="passErr"
                            show-password-toggle placeholder="••••••••"/>

            <button type="submit" :disabled="!formOk || auth.loading"
                    class="btn-primary w-full flex justify-center">
              <span v-if="!auth.loading">Entrar</span>
              <i v-else class="fas fa-spinner fa-spin"></i>
            </button>
          </form>

          <div class="text-center mt-6">
            <button @click="showReset=true"
                    class="text-sm text-primary hover:underline">¿Olvidaste tu contraseña?</button>
          </div>
        </div>
      </div>
    </main>

    <PasswordResetModal :show="showReset"
                        @close="showReset=false"
                        @submit="showReset=false"/>
  </div>
</template>
