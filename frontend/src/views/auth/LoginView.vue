<script setup lang="ts">
import { ref } from 'vue'
import { useRouter }   from 'vue-router'
import LoginView              from '@/layouts/LoginView.vue'
import LoginForm           from '@/views/auth/LoginForm.vue'
import RegistrationForm    from '@/views/auth/RegistrationForm.vue'
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal.vue'
import LoadingOverlay      from '@/components/ui/LoadingOverlay.vue'
import { useAuthStore }    from '@/store/useAuthStore.ts'

const router = useRouter()
const auth   = useAuthStore()

const showRegistration = ref(false)
const showForgot       = ref(false)
</script>

<template>
  <LoginView @show-registration="showRegistration = true" />

  <main class="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
    <LoginForm
        @logged="router.push('/')"
        @microsoft="console.log('OAuth MS')"
        @forgot="showForgot = true"
    />
  </main>

  <Teleport to="body">
    <RegistrationForm v-if="showRegistration" @close="showRegistration = false" />
    <ForgotPasswordModal v-if="showForgot" @close="showForgot = false" />
    <LoadingOverlay v-if="auth.loading" />
  </Teleport>
</template>
