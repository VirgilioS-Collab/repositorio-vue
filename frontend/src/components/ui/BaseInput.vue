<!--
  ------------------------------------------------------------------
  Componente BaseInput de entrada de texto reutilizable.
  • Emite `update:modelValue` para ser usado con v-model
  • Soporta etiqueta (`label`), placeholder y tipo de input
  • Lista para validación y manejo de errores desde el padre
  ------------------------------------------------------------------ -->

<script setup lang="ts">
/* --- Props & Emits ------------------------------------------------ */
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
}>()

defineEmits<{
  /** Se dispara cada vez que cambia el valor del input */
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="space-y-1">
    <!-- Etiqueta opcional -->
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <!-- Campo de entrada controlado -->
    <input
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full px-3 py-2 border border-gray-300 rounded-md
             focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</template>

<!-- No se requieren estilos extra; Tailwind cubre la presentación -->
