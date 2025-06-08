<script setup lang="ts">
import { ref } from 'vue'
//import { http } from '@/services/http'

const emit = defineEmits<{ (e:'close'):void }>()
const email = ref('')
const loading = ref(false)

async function send () {
  if (!email.value) return
  loading.value = true
  try { await http.post('/auth/reset', { email: email.value }) }
  finally {
    loading.value = false
    emit('close')
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-4 text-center">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75" @click="emit('close')" />
      <div class="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all sm:max-w-md w-full z-10">
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 flex items-center">
            <i class="fas fa-key text-[#FFC72C] mr-2" /> Recuperar&nbsp;Contraseña
          </h3>

          <p class="text-sm text-gray-500 my-4">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <input
              v-model="email"
              type="email"
              placeholder="correo@ejemplo.com"
              class="input-focus-effect w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FFC72C] focus:border-[#FFC72C]"
          />
        </div>

        <div class="bg-gray-50 p-4 flex justify-end space-x-3">
          <button
              @click="emit('close')"
              class="btn-hover-effect px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>

          <button
              :disabled="!email || loading"
              @click="send"
              class="btn-hover-effect px-4 py-2.5 rounded-lg bg-[#FFC72C] text-white hover:bg-[#E8B320]"
              :class="{ 'opacity-60 cursor-not-allowed': !email || loading }">
            <span v-if="!loading">Enviar enlace</span>
            <span v-else class="flex items-center"><i class="fas fa-spinner fa-spin mr-2" /> Enviando…</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
