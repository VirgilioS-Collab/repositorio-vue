<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore }  from '@/store/useAuthStore'

const emit = defineEmits<{ (e:'close'):void }>()
const auth = useAuthStore()

const form = ref({
  firstName:'', lastName:'', username:'', email:'', phone:'',
  docType:'Cédula', docNumber:'', birthDate:'',
  gender:'Masculino', password:'', confirmPassword:''
})

const emailOk = computed(() =>
    /^[A-Za-z0-9._%+-]+@utp\.ac\.pa$/i.test(form.value.email))

const pwdOk = computed(() =>
    form.value.password === form.value.confirmPassword)

async function submit () {
  if (!emailOk.value || !pwdOk.value) return
  await auth.userEnroll(form.value)
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center" @click.self="emit('close')">
    <div class="absolute inset-0 bg-gray-900/75 backdrop-blur-sm"></div>

    <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
      <header class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">
          <i class="fas fa-user-plus text-[#FFC72C] mr-2" /> Formulario de Inscripción
        </h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times" />
        </button>
      </header>

      <form @submit.prevent="submit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="form.firstName" required placeholder="Nombre"  class="input-focus-effect" />
          <input v-model="form.lastName"  required placeholder="Apellido" class="input-focus-effect" />
          <input v-model="form.username" required placeholder="Nombre de usuario" class="input-focus-effect" />

          <input v-model="form.email" required placeholder="nombre@utp.ac.pa"
                class="input-focus-effect"
                :class="{ 'border-red-500': form.email && !emailOk }" />

          <p v-if="form.email && !emailOk" class="md:col-span-2 text-xs text-red-500">
            El correo debe ser institucional (@utp.ac.pa)
          </p>


          <input v-model="form.phone" required placeholder="+50760000000"
                 pattern="^\+?507\d{4}-?\d{4}$" class="input-focus-effect" />

          <select v-model="form.docType" class="input-focus-effect">
            <option>Cédula</option><option>Pasaporte</option><option>Carné de Residente</option>
          </select>
          <input v-model="form.docNumber" required placeholder="N.º documento" class="input-focus-effect" />

          <input v-model="form.birthDate" required type="date" class="input-focus-effect" />
          <select v-model="form.gender" class="input-focus-effect">
            <option>Masculino</option><option>Femenino</option><option>Otro</option>
          </select>

          <input v-model="form.password"        required type="password" placeholder="Contraseña" class="input-focus-effect" />
          <input v-model="form.confirmPassword" required type="password" placeholder="Confirmar contraseña"
                 class="input-focus-effect" />
          <p v-if="!pwdOk" class="md:col-span-2 text-xs text-red-500">
            Las contraseñas no coinciden
          </p>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button type="button" @click="emit('close')"
                  class="px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit"
                  :disabled="auth.loading || !emailOk || !pwdOk"
                  class="px-4 py-2.5 rounded-lg text-white bg-[#FFC72C] hover:bg-[#E8B320]"
                  :class="{ 'opacity-60 cursor-not-allowed': auth.loading || !emailOk || !pwdOk }">
            <span v-if="!auth.loading">Registrar</span>
            <span v-else class="flex items-center"><i class="fas fa-spinner fa-spin mr-2" />Procesando…</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
