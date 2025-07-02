<script setup lang="ts">
/**
 * @file src/views/HomeView.vue
 * @description Vista principal de la aplicación.
 * Muestra las secciones de acciones rápidas, grupos y actividades del usuario.
 * - MODIFICADO: Ahora usa un único ModalOverlay que se muestra si cualquier
 * modal está activo, y dentro de él se renderiza el modal específico.
 * - MEJORA: Añadida gestión de estado de carga para el objeto 'user' para prevenir
 * errores al acceder a propiedades de 'null' antes de que los datos estén disponibles.
 * - REFACTORIZADO: Implementa un layout de dos columnas para un mejor
 * aprovechamiento del espacio y para mostrar widgets de información útil.
 */

// Sección de Librerías/Imports
// =============================================================================
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/useUserStore';

// Componentes de la vista principal
import QuickActions from '@/components/QuickActions.vue';
import GroupsSection from '@/components/GroupsSection.vue';
import ActivitiesSection from '@/components/ActivitiesSection.vue';

// Componentes de modales
import ViewProfileModal from '@/components/modals/ViewProfileModal.vue';
import EditProfileModal from '@/components/modals/EditProfileModal.vue';
import SecurityModal from '@/components/modals/SecurityModal.vue';
import CreateActivityModal from '@/components/modals/CreateActivityModal.vue';

// Componente del nuevo Overlay para modales
import ModalOverlay from '@/components/ui/ModalOverlay.vue';

// Componentes de UI generales
import ToastNotification from '@/components/ui/ToastNotification.vue';

// AÑADIDO: Importamos los nuevos widgets que vamos a crear
import UpcomingEventsWidget from '@/components/widgets/UpcomingEventsWidget.vue';
import CalendarWidget from '@/components/widgets/CalendarWidget.vue';
import NotificationsWidget from '@/components/widgets/NotificationsWidget.vue';


// Sección Principal (Script Setup)
// =============================================================================

const store = useUserStore();

// Desestructura las propiedades reactivas del store, incluyendo el getter `isAnyModalOpen`
// y el estado `user` y `loading`.
const {
  user, modals, toast, filteredGroups, showAllGroups, isAnyModalOpen, loading
} = storeToRefs(store);

const { toggleGroupsView } = store;

// Opcional: Cuando quites el mock, podrías disparar la carga del perfil aquí:
// import { onMounted } from 'vue';
// onMounted(() => {
//   store.fetchProfile();
// });
</script>

<template>
  <ModalOverlay v-if="isAnyModalOpen">
    <ViewProfileModal v-if="modals.viewProfile" />
    <EditProfileModal v-if="modals.editProfile" />
    <SecurityModal    v-if="modals.security"     />
    <CreateActivityModal v-if="modals.createActivity" />
    </ModalOverlay>

  <ToastNotification v-if="toast.show"
                     :message="toast.message"
                     :type="toast.type" />

  <main class="p-4 sm:p-6 lg:p-8">
    <div v-if="user" class="max-w-screen-xl mx-auto">
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 space-y-10">
          <QuickActions />
          <GroupsSection
              :groups="filteredGroups"
              :show-all-groups="showAllGroups"
              @toggle-groups-view="toggleGroupsView"
          />
          <ActivitiesSection :activities="user.activities ? user.activities : []" />
        </div>

        <div class="lg:col-span-1 space-y-8">
          <UpcomingEventsWidget :activities="user.activities ? user.activities : []" />
          <CalendarWidget :activities="user.activities ? user.activities : []" />
          <NotificationsWidget />
        </div>

      </div>
    </div>

    <div v-else class="text-center py-16">
      <p v-if="loading" class="text-gray-500 text-lg font-medium">Cargando información del usuario...</p>
      <p v-else class="text-gray-500 text-lg font-medium">No se pudo cargar la información del usuario.</p>
    </div>
  </main>
</template>

