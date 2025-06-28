<script setup lang="ts">
/**
 * @file: src/layouts/AdminView.vue
 * - CORREGIDO: Ahora importa y utiliza correctamente useClubStore.
 * - LIMPIEZA: Eliminados imports no utilizados.
 */
import { onMounted } from 'vue';
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

onMounted(() => {
    const clubId = Number(route.params.id);
    if (clubId) {
        clubStore.fetchDetails(clubId);
    }
});
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 flex-shrink-0 flex flex-col bg-primary text-white">
      <div class="px-4 py-6 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full border-2 border-accent bg-white flex items-center justify-center shrink-0">
            <span class="text-primary font-bold">
              {{ clubDetails?.group_name?.substring(0, 2).toUpperCase() || '...' }}
            </span>
          </div>
          <div>
            <h2 class="font-semibold leading-none">{{ clubDetails?.group_name || 'Cargando...' }}</h2>
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

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 bg-white shadow-sm flex-shrink-0 flex items-center justify-between px-6 z-10">
        <h1 class="text-xl font-bold text-darkText">{{ route.meta.title || 'Administración' }}</h1>
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