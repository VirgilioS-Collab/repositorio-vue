<script setup lang="ts">
// --- SECCIÓN DE LIBRERÍAS/IMPORTS ---
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/useAuthStore';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import NotificationPanel from '@/components/NotificationPanel.vue';

// --- SECCIÓN DE STORES Y ROUTER ---
const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

// --- SECCIÓN DE ESTADO LOCAL ---
const isMobileMenuOpen = ref(false);
const userMenuButton = ref<HTMLElement | null>(null);
const userMenuDropdown = ref<HTMLElement | null>(null);

// --- SECCIÓN DE PROPIEDADES COMPUTADAS ---
const userName = computed((): string => authStore.currentUser?.u_name || 'Usuario');
const userPhoto = computed((): string | undefined => authStore.currentUser?.u_profile_photo_url || undefined);
const isUserMenuOpen = computed(() => userStore.showProfileDropdown);

// --- SECCIÓN DE FUNCIONES ---
function handleLogout(): void {
  authStore.logout();
  userStore.closeAllModals();
  router.push({ name: 'Login' });
}

function handleOpenModalAndCloseMenu(
  modalName: 'viewProfile' | 'security',
  menuType: 'desktop' | 'mobile'
): void {
  userStore.openModal(modalName);
  if (menuType === 'desktop') {
    userStore.toggleProfileDropdown(); // Cierra el menú usando la acción del store
  } else {
    isMobileMenuOpen.value = false;
  }
}

function handleClickOutside(event: MouseEvent) {
  if (isUserMenuOpen.value && userMenuDropdown.value && userMenuButton.value &&
      !userMenuDropdown.value.contains(event.target as Node) &&
      !userMenuButton.value.contains(event.target as Node)) {
    userStore.toggleProfileDropdown(); // Cierra el menú usando la acción del store
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav class="bg-primary text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">
        
        <div class="flex items-center">
          <RouterLink :to="{ name: 'Home' }" class="flex-shrink-0 flex items-center gap-2">
            <img src="@/assets/stroke_logo.svg" alt="Logo Alianza UTP" class="h-8 w-auto">
            <span class="text-xl font-bold">Alianza UTP</span>
          </RouterLink>
          
          <div class="hidden md:block md:ml-10">
            <div class="flex items-baseline space-x-4">
              <RouterLink :to="{ name: 'Home' }" class="nav-link" active-class="nav-link-active">Inicio</RouterLink>
              <RouterLink :to="{ name: 'ClubList' }" class="nav-link" active-class="nav-link-active">Clubs</RouterLink>
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
              <button ref="userMenuButton" @click="userStore.toggleProfileDropdown()" class="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white">
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
                <div ref="userMenuDropdown" v-if="isUserMenuOpen" @click.stop class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="px-4 py-3 border-b border-gray-200">
                    <div class="flex items-center gap-3">
                      <img v-if="userPhoto" class="h-10 w-10 rounded-full object-cover" :src="userPhoto" alt="Foto de perfil">
                      <div v-else class="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-primary text-lg">{{ userName.charAt(0) }}</div>
                      <div>
                        <p class="text-sm font-semibold text-darkText">{{ userName }}</p>
                        <p class="text-xs text-gray-500">{{ authStore.currentUser?.u_email }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="py-1">
                    <a href="#" @click.prevent="handleOpenModalAndCloseMenu('viewProfile', 'desktop')" class="user-menu-item">Mi Perfil</a>
                    <a href="#" @click.prevent="handleOpenModalAndCloseMenu('security', 'desktop')" class="user-menu-item">Seguridad</a>
                    <a href="#" @click.prevent="handleLogout" class="user-menu-item">Cerrar Sesión</a>
                  </div>
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
        <RouterLink :to="{ name: 'ClubList' }" @click="isMobileMenuOpen = false" class="mobile-nav-link" active-class="mobile-nav-link-active">Clubs</RouterLink>
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
            <div class="text-sm font-medium text-gray-300">{{ authStore.currentUser?.u_email }}</div>
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