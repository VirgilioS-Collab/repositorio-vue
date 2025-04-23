<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full mx-4 md:w-3/5 lg:w-2/5">
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-bold text-gray-800">Configuración de Seguridad</h3>
        <button @click="$emit('cancel')" class="text-gray-500 hover:text-gray-700">
          <LucideIcon name="x" class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <h4 class="text-sm font-medium text-gray-500">CAMBIAR CONTRASEÑA</h4>

        <BaseInput
          label="Contraseña actual"
          v-model="form.currentPassword"
          type="password"
          placeholder="Ingresa tu contraseña actual"
        />
        <BaseInput
          label="Nueva contraseña"
          v-model="form.newPassword"
          type="password"
          placeholder="Ingresa tu nueva contraseña"
        />
        <BaseInput
          label="Confirmar nueva contraseña"
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirma tu nueva contraseña"
        />
      </div>

      <div class="p-4 border-t flex justify-end space-x-3">
        <button @click="$emit('cancel')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button @click="$emit('save', form)" class="px-4 py-2 bg-[#E4B95B] text-[#00205B] rounded-md hover:bg-yellow-600">
          Guardar cambios
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
//import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseInput from '@/components/ui/BaseInput.vue';

const props = defineProps<{
  security: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
}>();

const emit = defineEmits(['cancel', 'save']);

const form = reactive({ ...props.security });

watch(() => props.security, (newVal) => {
  Object.assign(form, newVal);
});
</script>
