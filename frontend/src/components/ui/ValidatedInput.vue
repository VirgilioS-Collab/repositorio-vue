<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  icon?: string          /* clase font-awesome */
  error?: string
  label?: string
  showPasswordToggle?: boolean
}>()
const emit = defineEmits<{ (e:'update:modelValue', v:string):void }>()

const showPassword = ref(false)
const inputType = computed(() =>
    props.type === 'password'
        ? showPassword.value ? 'text' : 'password'
        : props.type ?? 'text'
)
</script>

<template>
  <div>
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-700">{{ label }}</label>

    <div class="relative">
      <i v-if="icon" :class="icon + ' absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'"></i>

      <input
          :type="inputType"
          :value="modelValue"
          @input="e => emit('update:modelValue', (e.target as HTMLInputElement).value)"
          :placeholder="placeholder"
          class="w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-accent focus:outline-none"
          :class="error && 'border-red-500'"
      />

      <button v-if="type==='password' && showPasswordToggle"
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
      </button>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
