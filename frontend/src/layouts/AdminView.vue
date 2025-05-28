<script setup lang="ts">
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { useAuthStore }  from '@/store/useAuthStore'
import LucideIcon        from '@/components/ui/LucideIcon.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'

const route = useRoute()
const auth  = useAuthStore()

function logout () {
  auth.logout()
  route.router.push({ name:'login' })
}

const menu = [
  { to:'club-dashboard',  label:'Dashboard',   icon:'layout-dashboard' },
  { to:'club-activities', label:'Actividades', icon:'calendar'         },
  { to:'club-members',    label:'Miembros',    icon:'users'            },
  { to:'club-settings',   label:'Ajustes',     icon:'settings'         }
]
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- ░░ Sidebar ░░ -->
    <aside class="w-64 flex flex-col bg-utp-blue text-white">
      <div class="px-4 py-6 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full border-2 border-utp-yellow bg-white flex items-center justify-center">
            <span class="text-utp-blue font-bold">FC</span>
          </div>
          <div>
            <h2 class="font-semibold leading-none">Fotografía Creativa</h2>
            <p class="text-xs text-white/70">Club UTP</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-6">
        <RouterLink
            v-for="m in menu" :key="m.to"
            :to="{ name:m.to, params:route.params }"
            class="flex items-center gap-3 px-4 py-2 text-sm rounded-md hover:bg-white/10"
            :class="route.name===m.to ? 'bg-white text-utp-blue font-medium' : 'text-white/80'"
        >
          <LucideIcon :name="m.icon" :size="18" />
          {{ m.label }}
        </RouterLink>
      </nav>

      <button @click="logout" class="flex items-center gap-3 px-4 py-4 text-sm text-white/80 hover:bg-white/10">
        <LucideIcon name="log-out" :size="18" /> Cerrar sesión
      </button>
    </aside>

    <!-- ░░ Panel principal ░░ -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="h-14 bg-white shadow-sm flex items-center justify-between px-6">
        <h1 class="text-lg font-semibold text-gray-900">
          <RouterView v-slot="{ Component }">
            <component :is="Component" v-slot:title />
          </RouterView>
        </h1>

        <div class="flex items-center gap-4">
          <button class="relative p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <LucideIcon name="bell" :size="20" />
            <span class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"/>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-utp-blue text-white flex items-center justify-center text-sm">JM</div>
            <span class="hidden md:block text-sm font-medium">Juan&nbsp;Martínez</span>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-7xl mx-auto space-y-8">
          <RouterView />
        </div>
      </main>

      <ToastNotification />
    </div>
  </div>
</template>
