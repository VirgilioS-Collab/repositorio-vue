<script setup lang="ts">
/**
 * @file: src/layouts/AdminView.vue
 * - CORREGIDO: Ahora importa y utiliza correctamente useClubStore.
 * - LIMPIEZA: Eliminados imports no utilizados.
 */
import { onMounted, ref } from 'vue';
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router';
import { useAuthStore }  from '@/store/useAuthStore';
import { useClubStore } from '@/store/useClubStore'; 
import { useUserStore } from '@/store/useUserStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import ToastNotification from '@/components/ui/ToastNotification.vue';

const route = useRoute();
const router = useRouter();
const authStore  = useAuthStore();
const clubStore = useClubStore();
const userStore = useUserStore();

const { details: clubDetails } = storeToRefs(clubStore);
const { toast } = storeToRefs(userStore);

const isMobileMenuOpen = ref(false);

const menu = [
  { name: 'Dashboard',  label:'Dashboard',   icon:'layout-dashboard' },
  { name: 'Activities', label:'Actividades', icon:'calendar' },
  { name: 'Members',    label:'Miembros',    icon:'users' },
  { name: 'Settings',   label:'Ajustes',     icon:'settings' }
];

function logout () {
  authStore.logout();
  router.push({ name:'Login' });
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

onMounted(() => {
    const clubId = Number(route.params.id);
    if (clubId) {
        clubStore.fetchDetails(clubId);
    }
});
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar para desktop -->
    <aside class="w-64 flex-shrink-0 flex-col bg-primary text-white hidden md:flex">
      <div class="px-4 py-6 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full border-2 border-accent bg-white flex items-center justify-center shrink-0">
            <span class="text-primary font-bold">
              {{ clubDetails?.name?.substring(0, 2).toUpperCase() || '...' }}
            </span>
          </div>
          <div>
            <h2 class="font-semibold leading-none">{{ clubDetails?.name || 'Cargando...' }}</h2>
            <p class="text-xs text-white/70">Club UTP</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-4">
        <ul>
          <li v-for="m in menu" :key="m.name" class="px-2">
            <RouterLink
                :to="{ name: m.name, params: { id: route.params.id } }"
                class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors"
                :class="route.name === m.name ? 'bg-accent text-primary font-bold shadow-inner' : 'text-white/80 hover:bg-white/10'"
            >
              <LucideIcon :name="m.icon" :size="18" />
              <span>{{ m.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="px-2 py-4 border-t border-white/10">
        <button @click="logout" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 rounded-md">
          <LucideIcon name="log-out" :size="18" /> Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Overlay para el menú móvil -->
    <div v-if="isMobileMenuOpen" @click="closeMobileMenu" class="fixed inset-0 bg-black/50 z-40 md:hidden"></div>

    <!-- Menú lateral móvil -->
    <aside :class="[isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full', 'fixed inset-y-0 left-0 w-64 bg-primary text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden']">
      <div class="px-4 py-6 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full border-2 border-accent bg-white flex items-center justify-center shrink-0">
            <span class="text-primary font-bold">
              {{ clubDetails?.name?.substring(0, 2).toUpperCase() || '...' }}
            </span>
          </div>
          <div>
            <h2 class="font-semibold leading-none">{{ clubDetails?.name || 'Cargando...' }}</h2>
            <p class="text-xs text-white/70">Club UTP</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-4">
        <ul>
          <li v-for="m in menu" :key="m.name" class="px-2">
            <RouterLink
                :to="{ name: m.name, params: { id: route.params.id } }"
                class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors"
                :class="route.name === m.name ? 'bg-accent text-primary font-bold shadow-inner' : 'text-white/80 hover:bg-white/10'"
                @click="closeMobileMenu"
            >
              <LucideIcon :name="m.icon" :size="18" />
              <span>{{ m.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="px-2 py-4 border-t border-white/10">
        <button @click="logout" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 rounded-md">
          <LucideIcon name="log-out" :size="18" /> Cerrar sesión
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 bg-white shadow-sm flex-shrink-0 flex items-center justify-between px-6 z-10">
        <button @click="isMobileMenuOpen = true" class="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
          <LucideIcon name="menu" :size="24" />
        </button>
        <h1 class="text-xl font-bold text-darkText">{{ route.meta.title || 'Administración' }}</h1>
        <div class="hidden md:block"></div> <!-- Placeholder para mantener el justify-between -->
      </header>
      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-7xl mx-auto space-y-8">
          <RouterView :key="route.fullPath" />
        </div>
      </main>
      <ToastNotification v-if="toast.show" :message="toast.message" :type="toast.type" />
    </div>
  </div>
</template>