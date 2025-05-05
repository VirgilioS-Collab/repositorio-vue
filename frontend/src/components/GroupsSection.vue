<!--
  Componente “GroupsSection”
  ------------------------------------------------------------------
  • Lista los grupos del usuario y, opcionalmente, el resto al pulsar “Ver más”.
  • Usa <LucideIcon /> para todos los SVG.
  • Todas las cadenas de icono provienen del catálogo central utils/icons.ts
  ------------------------------------------------------------------ -->

<script setup lang="ts">
import type { IconKey } from '@/utils/icons'
import LucideIcon    from '@/components/ui/LucideIcon.vue'

/* ---------- Props ---------- */
defineProps<{
  groups: Array<{
    id:          number
    name:        string
    description: string
    members:     number
    icon:        IconKey
    isMember:    boolean
  }>
  showAllGroups: boolean
}>()

/* ---------- Emits ---------- */
defineEmits<{ (e:'toggle-groups-view'): void }>()
</script>

<template>
  <section class="mb-10">
    <!-- Cabecera -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
        <LucideIcon name="users" size="24" class="text-[#E4B95B] mr-2" />
        Mis Grupos
      </h2>

      <button
          @click="$emit('toggle-groups-view')"
          class="text-sm bg-[#00205B] text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
      >
        {{ showAllGroups ? 'Ver menos' : 'Ver más' }}
      </button>
    </div>

    <!-- Tarjetas -->
    <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
          v-for="group in groups"
          :key="group.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transition"
      >
        <div class="p-4 sm:p-5">
          <!-- Icono circular -->
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 rounded-full bg-[#00205B] flex items-center justify-center mr-3">
              <LucideIcon
                  :name="group.icon"
                  size="20"
                  class="text-[#E4B95B]"
              />
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-800 text-sm sm:text-base truncate">
                {{ group.name }}
              </h3>
              <span
                  v-if="group.isMember"
                  class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
              >
                Miembro
              </span>
            </div>
          </div>

          <!-- Descripción -->
          <p class="text-xs sm:text-sm text-gray-600 mb-3">
            {{ group.description }}
          </p>

          <!-- Footer / acciones -->
          <div class="flex justify-between items-center text-xs sm:text-sm">
            <span class="text-gray-500">{{ group.members }} miembros</span>

            <!-- Contexto: listado completo vs. solo “mis grupos” -->
            <template v-if="showAllGroups">
              <button
                  v-if="!group.isMember"
                  class="bg-[#00205B] text-white px-2 sm:px-3 py-1 rounded-md hover:bg-blue-700 transition"
              >
                Unirse
              </button>
              <span v-else class="text-green-600 font-medium">
                Ya eres miembro
              </span>
            </template>

            <button
                v-else
                class="bg-[#00205B] text-white px-2 sm:px-3 py-1 rounded-md hover:bg-blue-700 transition"
            >
              Ver grupo
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Todo el estilo se gestiona con Tailwind */
</style>
