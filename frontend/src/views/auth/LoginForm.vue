<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore }   from '@/store/useAuthStore.ts'

const emit = defineEmits<{ (e:'logged'):void, (e:'microsoft'):void, (e:'forgot'):void }>()
const email      = ref('')
const password   = ref('')
const showPwd    = ref(false)
const auth       = useAuthStore()

const formOk = computed(() => !!email.value && !!password.value && !auth.loading)

async function submit () {
  if (!formOk.value) return
  await auth.login(email.value, password.value)
  if (auth.isLogged) emit('logged')
}
</script>

<template>
  <div class="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="px-8 py-10">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Iniciar Sesión</h2>
      <p class="text-center text-gray-600 mb-8">Ingresa tus credenciales</p>

      <form @submit.prevent="submit" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
          <div class="relative">
            <i class="fas fa-envelope text-gray-400 absolute inset-y-0 left-0 pl-3 flex items-center" />
            <input
                v-model="email"
                type="email"
                placeholder="correo@utpa.ac.pa"
                class="input-focus-effect pl-10 w-full py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFC72C]"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <div class="relative">
            <i class="fas fa-lock text-gray-400 absolute inset-y-0 left-0 pl-3 flex items-center" />
            <input
                v-model="password"
                :type="showPwd ? 'text' : 'password'"
                placeholder="••••••••"
                class="input-focus-effect pl-10 pr-10 w-full py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFC72C]"
            />
            <button type="button" @click="showPwd = !showPwd" class="icon-hover-effect absolute inset-y-0 right-0 pr-3 flex items-center">
              <i :class="showPwd ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        <!-- Botón -->
        <button
            type="submit"
            :disabled="!formOk"
            class="btn-hover-effect w-full py-2.5 rounded-lg text-white bg-[#FFC72C] hover:bg-[#E8B320]"
            :class="{ 'opacity-60 cursor-not-allowed': !formOk }">
          <span v-if="!auth.loading">Entrar</span>
          <span v-else class="flex items-center"><i class="fas fa-spinner fa-spin mr-2" /> Procesando…</span>
        </button>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200" /></div>
          <div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500">o continúa con</span></div>
        </div>

        <!-- Microsoft -->
        <button
            type="button"
            @click="emit('microsoft')"
            :disabled="auth.loading"
            class="btn-hover-effect w-full py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" class="h-5 w-5 inline mr-2" />
          Acceder con Microsoft
        </button>

        <!-- Forgot -->
        <button
            type="button"
            @click="emit('forgot')"
            class="block mx-auto mt-4 text-sm font-medium text-[#00205B] hover:text-[#00113D]">
          ¿Olvidaste tu contraseña?
        </button>
      </form>
    </div>
  </div>
</template>
