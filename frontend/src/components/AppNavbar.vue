<script setup lang="ts">
/**
 * @file src/components/AppNavbar.vue
 * @description Navbar principal de la aplicación. Es un componente inteligente y
 * responsivo que gestiona la navegación principal, el menú de usuario, las
 * notificaciones y se adapta a diferentes tamaños de pantalla.
 */

// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/useAuthStore';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import NotificationPanel from '@/components/NotificationPanel.vue';

// --- SECCIÓN DE STORES Y ROUTER ---
/**
 * @docstring
 * Instancia del store de usuario para acceder a los datos del perfil
 * y a las acciones de la UI (modales, notificaciones).
 */
const userStore = useUserStore();

/**
 * @docstring
 * Instancia del store de autenticación, usado específicamente para la
 * acción de cerrar sesión.
 */
const authStore = useAuthStore();

/**
 * @docstring
 * Instancia del enrutador de Vue para la redirección programática.
 */
const router = useRouter();


// --- SECCIÓN DE ESTADO LOCAL ---
/**
 * @docstring
 * Controla la visibilidad del menú de navegación en dispositivos móviles (hamburguesa).
 * @type {ref<boolean>}
 */
const isMobileMenuOpen = ref(false);

/**
 * @docstring
 * Controla la visibilidad del menú desplegable del perfil de usuario en desktop.
 * @type {ref<boolean>}
 */
const isUserMenuOpen = ref(false);


// --- SECCIÓN DE PROPIEDADES COMPUTADAS ---
/**
 * @docstring
 * Obtiene el nombre del usuario para mostrarlo en la UI. Provee un valor
 * por defecto ('Usuario') si el perfil aún no se ha cargado.
 * @returns {string}
 */
const userName = computed((): string => userStore.user?.name || 'Usuario');

/**
 * @docstring
 * Obtiene la URL de la foto de perfil del usuario.
 * @returns {string | undefined}
 */
const userPhoto = computed((): string | undefined => userStore.user?.profile_photo_url);


// --- SECCIÓN DE FUNCIONES ---
/**
 * @docstring
 * Cierra la sesión del usuario llamando a la acción del authStore,
 * cierra todos los modales/paneles y redirige a la página de Login.
 * @returns {void}
 */
function handleLogout(): void {
  authStore.logout();
  userStore.closeAllModals(); // Cierra modales y panel de notificaciones
  router.push({ name: 'Login' });
}

/**
 * @docstring
 * Función de ayuda para abrir un modal y cerrar el menú desde el que se llamó,
 * ya sea el menú de usuario de escritorio o el menú móvil.
 * @param {'viewProfile' | 'security'} modalName - El nombre del modal a abrir.
 * @param {'desktop' | 'mobile'} menuType - El tipo de menú que invoca la acción.
 * @returns {void}
 */
function handleOpenModalAndCloseMenu(
  modalName: 'viewProfile' | 'security',
  menuType: 'desktop' | 'mobile'
): void {
  userStore.openModal(modalName);
  if (menuType === 'desktop') {
    isUserMenuOpen.value = false;
  } else {
    isMobileMenuOpen.value = false;
  }
}
</script>

<template>
  <nav class="bg-primary text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">
        
        <div class="flex items-center">
          <RouterLink :to="{ name: 'Home' }" class="flex-shrink-0 flex items-center gap-2">
            <LucideIcon name="book" :size="28" class="text-accent" />
            <span class="text-xl font-bold">Alianza UTP</span>
          </RouterLink>
          
          <div class="hidden md:block md:ml-10">
            <div class="flex items-baseline space-x-4">
              <RouterLink :to="{ name: 'Home' }" class="nav-link" active-class="nav-link-active">Inicio</RouterLink>
              <RouterLink :to="{ name: 'GroupList' }" class="nav-link" active-class="nav-link-active">Grupos</RouterLink>
              <RouterLink :to="{ name: 'ActivityList' }" class="nav-link" active-class="nav-link-active">Actividades</RouterLink>
            </div>
          </div>
        </div>

        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6 gap-4">
            <div class="relative">
              <button @click="userStore.toggleNotificationPanel()" class="relative p-1 rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-white" aria-label="Ver notificaciones">
                <LucideIcon name="bell" :size="24" />
                <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-primary"></span>
              </button>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <NotificationPanel v-if="userStore.showNotificationPanel" />
              </transition>
            </div>

            <div class="relative">
              <button @click="isUserMenuOpen = !isUserMenuOpen" class="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white">
                <span class="sr-only">Abrir menú de usuario</span>
                <img v-if="userPhoto" class="h-8 w-8 rounded-full object-cover" :src="userPhoto" alt="Foto de perfil">
                <div v-else class="h-8 w-8 rounded-full bg-accent flex items-center justify-center font-bold text-primary">{{ userName.charAt(0) }}</div>
                <span class="hidden lg:block">{{ userName }}</span>
                <LucideIcon name="chevron-down" :size="16" class="hidden lg:block transition-transform" :class="{ 'rotate-180': isUserMenuOpen }" />
              </button>
              
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="isUserMenuOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-card ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a href="#" @click.prevent="handleOpenModalAndCloseMenu('viewProfile', 'desktop')" class="user-menu-item">Mi Perfil</a>
                  <a href="#" @click.prevent="handleOpenModalAndCloseMenu('security', 'desktop')" class="user-menu-item">Seguridad</a>
                  <a href="#" @click.prevent="handleLogout" class="user-menu-item">Cerrar Sesión</a>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div class="-mr-2 flex md:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-white" aria-label="Abrir menú principal">
            <LucideIcon v-if="!isMobileMenuOpen" name="menu" :size="24" />
            <LucideIcon v-else name="x" :size="24" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <RouterLink :to="{ name: 'Home' }" @click="isMobileMenuOpen = false" class="mobile-nav-link" active-class="mobile-nav-link-active">Inicio</RouterLink>
        <RouterLink :to="{ name: 'GroupList' }" @click="isMobileMenuOpen = false" class="mobile-nav-link" active-class="mobile-nav-link-active">Grupos</RouterLink>
        <RouterLink :to="{ name: 'ActivityList' }" @click="isMobileMenuOpen = false" class="mobile-nav-link" active-class="mobile-nav-link-active">Actividades</RouterLink>
      </div>
      <div class="pt-4 pb-3 border-t border-primary-dark">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
             <img v-if="userPhoto" class="h-10 w-10 rounded-full object-cover" :src="userPhoto" alt="Foto de perfil">
             <div v-else class="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-primary text-xl">{{ userName.charAt(0) }}</div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium">{{ userName }}</div>
            <div class="text-sm font-medium text-gray-300">{{ userStore.user?.email }}</div>
          </div>
           <button @click="userStore.toggleNotificationPanel(); isMobileMenuOpen = false" class="relative ml-auto flex-shrink-0 p-1 rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-white" aria-label="Ver notificaciones">
            <LucideIcon name="bell" :size="24" />
          </button>
        </div>
        <div class="mt-3 px-2 space-y-1">
          <a href="#" @click.prevent="handleOpenModalAndCloseMenu('viewProfile', 'mobile')" class="user-menu-item-mobile">Mi Perfil</a>
          <a href="#" @click.prevent="handleOpenModalAndCloseMenu('security', 'mobile')" class="user-menu-item-mobile">Seguridad</a>
          <a href="#" @click.prevent="handleLogout" class="user-menu-item-mobile">Cerrar Sesión</a>
        </div>
      </div>
    </div>
  </nav>
</template>