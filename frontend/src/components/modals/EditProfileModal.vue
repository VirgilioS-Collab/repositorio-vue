<!--
  ------------------------------------------------------------------
  Modal para editar los datos básicos del usuario.
  • Utiliza <BaseInput /> como campo controlado
  • Icono de cierre renderizado con <LucideIcon />
  ------------------------------------------------------------------ -->

<script setup lang="ts">
import { reactive, watch }           from 'vue'
import LucideIcon                    from '@/components/ui/LucideIcon.vue'
import BaseInput                     from '@/components/ui/BaseInput.vue'

/* ---- props & emits ------------------------------------------------ */
const props = defineProps<{
  user: {
    name:   string
    email:  string
    career: string
  }
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save', payload: typeof props.user): void
}>()

/* ---- formulario local (clonado) ---------------------------------- */
const form = reactive({ ...props.user })

watch(
    () => props.user,
    (vals) => Object.assign(form, vals)
)
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full mx-4 md:w-3/5 lg:w-2/5">
      <!-- Cabecera -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-bold text-gray-800">
          Editar información personal
        </h3>

        <button @click="emit('cancel')" class="text-gray-500 hover:text-gray-700">
          <LucideIcon name="x" size="24" />
        </button>
      </div>

      <!-- Cuerpo -->
      <div class="p-6 space-y-6">
        <h4 class="text-sm font-medium text-gray-500">INFORMACIÓN PERSONAL</h4>

        <BaseInput label="Nombre completo"      v-model="form.name"   type="text"   />
        <BaseInput label="Correo electrónico"   v-model="form.email"  type="email"  />
        <BaseInput label="Carrera"              v-model="form.career" type="text"   />
      </div>

      <!-- Pie -->
      <div class="p-4 border-t flex justify-end gap-3">
        <button
            @click="emit('cancel')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
            @click="emit('save', form)"
            class="px-4 py-2 bg-[#E4B95B] text-[#00205B] rounded-md hover:bg-yellow-600"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  </div>
</template>
