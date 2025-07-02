<script setup lang="ts">
/**
 * @file src/views/auth/RegistrationView.vue
 * @description Vista para el registro de nuevos usuarios.
 * Adopta el layout de "tarjeta grande" con dos columnas para mantener
 * la consistencia visual con la vista de Login.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { useRouter } from 'vue-router'
import RegistrationForm from '@/views/auth/RegistrationForm.vue'
import { useAuthStore } from '@/store/useAuthStore' // Aunque RegistrationForm ya no usa authStore, se mantiene si es necesario para LoadingOverlay
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'

// --- SECCIÓN DE CONSTANTES ---
const router = useRouter()
const authStore = useAuthStore() // Se mantiene si `LoadingOverlay` se basa en `authStore.loading` global

// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Callback que se ejecuta tras un registro exitoso.
 * Redirige al usuario a la página de Login, opcionalmente con un
 * parámetro para mostrar un mensaje de éxito.
 * @effects Redirige al usuario a la ruta de login.
 */
function onRegisteredSuccessfully(): void {
  router.push({ name: 'Login', query: { registered: 'true' } })
}
</script>

<template>
  <main class="bg-soft min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-screen-xl 
                bg-card rounded-2xl shadow-2xl flex overflow-hidden my-8 sm:my-12">
      
      <div class="hidden lg:flex w-1/2 p-8 lg:p-12 flex-col justify-center items-start">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary">
          Únete a la Comunidad
        </h1>
        <p class="text-lg sm:text-xl lg:text-2xl mt-4 text-darkText leading-tight">
          Crea tu cuenta para acceder a todos los beneficios y gestionar tus actividades.
        </p>
      </div>

      <div class="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-gray-50/50">
        <RegistrationForm @registered="onRegisteredSuccessfully" />
      </div>
    </div>
  </main>

  <Teleport to="body">
    <LoadingOverlay v-if="authStore.loading" />
  </Teleport>
</template>