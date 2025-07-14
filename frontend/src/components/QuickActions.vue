<script setup lang="ts">
/**
 * @file src/components/QuickActions.vue
 * @description Muestra un cabezal de bienvenida y acciones rápidas contextuales.
 * - REDISEÑADO: Ahora es una "Tarjeta de Bienvenida" para anclar visualmente las acciones.
 * - AÑADIDO: Lógica de permisos. El botón "Crear actividad" solo es visible
 * para usuarios con roles de administrador o líder.
 * - MODIFICADO: Incluye foto de perfil del usuario.
 */
import { computed } from 'vue';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/useAuthStore';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload.vue';

const userStore = useUserStore();
const authStore = useAuthStore();

// Obtenemos el nombre del usuario para el saludo.
const userName = computed(() => authStore.currentUser?.u_name || '');

/**
 * @docstring
 * Propiedad computada que determina si el usuario actual tiene permisos
 * para crear contenido (actividades, clubs, etc.).
 * @returns {boolean}
 */
const userCanCreateContent = computed(() => {
  const userType = authStore.currentUser?.u_user_type;
  // Ajusta los roles según tu backend (ej. 'admin', 'leader', 'moderator')
  return userType === 'admin' || userType === 'leader';
});
</script>

<template>
  <div class="mb-10 p-6 bg-card border border-gray-200 rounded-xl shadow-sm">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      
      <div class="flex items-center gap-4">
        <!-- Foto de perfil del usuario -->
        <ProfilePictureUpload 
          :current-image-url="authStore.currentUser?.u_profile_photo_url"
          size="medium"
          :show-upload-button="false"
        />
        
        <div>
          <h2 class="text-2xl font-bold text-darkText">¡Bienvenida, {{ userName }}!</h2>
          <p class="text-gray-500">¿Qué te gustaría hacer hoy?</p>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2 sm:gap-3 shrink-0">
        
        <button
          v-if="userCanCreateContent"
          @click="userStore.openModal('createActivity')"
          class="btn-quick-action bg-accent text-primary border-transparent"
          aria-label="Crear nueva actividad"
        >
          <LucideIcon name="plus-circle" :size="20" />
          <span class="hidden sm:inline">Crear actividad</span>
        </button>

        <button 
          @click="userStore.openModal('joinClub')"
          class="btn-quick-action bg-white text-darkText border-gray-300"
          aria-label="Unirme a un club existente"
        >
          <LucideIcon name="users" :size="20" />
          <span class="hidden sm:inline">Unirme a club</span>
        </button>

        <RouterLink
          :to="{ name: 'ActivityList' }"
          class="btn-quick-action bg-white text-darkText border-gray-300"
          aria-label="Buscar eventos y actividades"
        >
          <LucideIcon name="search" :size="20" />
          <span class="hidden sm:inline">Buscar eventos</span>
        </RouterLink>

      </div>
    </div>
  </div>
</template>

<!-- Los estilos para .btn-quick-action ahora están centralizados en style.css -->