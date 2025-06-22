<script setup lang="ts">
/**
 * @file src/views/HomeView.vue
 * - REFACTORIZADO: Se implementa un layout de dos columnas para un mejor
 * aprovechamiento del espacio y para mostrar widgets de información útil.
 */
// ... (imports existentes) ...
// AÑADIDO: Importamos los nuevos widgets que vamos a crear
import UpcomingEventsWidget from '@/components/widgets/UpcomingEventsWidget.vue';
import CalendarWidget from '@/components/widgets/CalendarWidget.vue';
import NotificationsWidget from '@/components/widgets/NotificationsWidget.vue';
// ... (resto del script setup sin cambios) ...
</script>

<template>
  <main class="p-4 sm:p-6 lg:p-8">
    <div v-if="user" class="max-w-screen-xl mx-auto">
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 space-y-10">
          <QuickActions />
          <GroupsSection :groups="filteredGroups" ... />
          <ActivitiesSection :activities="user.activities" />
        </div>

        <div class="lg:col-span-1 space-y-8">
          <UpcomingEventsWidget :activities="user.activities" />
          <CalendarWidget :activities="user.activities" />
          <NotificationsWidget />
        </div>

      </div>
    </div>
    </main>
</template>