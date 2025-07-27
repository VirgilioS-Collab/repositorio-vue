<template>
  <button
    :class="buttonClass"
    :disabled="disabled || loading"
  >
    <div v-if="loading" class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
    </div>
    <div v-else class="flex items-center gap-2">
      <slot name="icon"></slot>
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'danger', 'accent'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const baseClasses = 'px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed',
  secondary: 'bg-gray-200 text-darkText hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed',
  accent: 'bg-accent text-primary hover:bg-accent-dark focus:ring-accent disabled:bg-yellow-200 disabled:cursor-not-allowed',
};

const buttonClass = computed(() => [
  baseClasses,
  variantClasses[props.variant as keyof typeof variantClasses],
  { 'cursor-not-allowed opacity-75': props.disabled || props.loading }
]);
</script>
