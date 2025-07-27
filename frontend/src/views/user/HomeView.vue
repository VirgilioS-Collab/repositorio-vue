<script setup lang="ts">
/**
 * @file src/views/HomeView.vue
 * @description Vista principal de la aplicación.
 * Muestra las secciones de acciones rápidas, clubs y actividades del usuario.
 * - MODIFICADO: Ahora usa un único ModalOverlay que se muestra si cualquier
 * modal está activo, y dentro de él se renderiza el modal específico.
 * - MEJORA: Añadida gestión de estado de carga para el objeto 'user' para prevenir
 * errores al acceder a propiedades de 'null' antes de que los datos estén disponibles.
 * - REFACTORIZADO: Implementa un layout de dos columnas para un mejor
 * aprovechamiento del espacio y para mostrar widgets de información útil.
 * - AÑADIDO: Carga automática de datos del usuario al montar el componente.
 */

// Sección de Librerías/Imports
// =============================================================================
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/useAuthStore';

// Componentes de la vista principal
import QuickActions from '@/components/QuickActions.vue';
import ClubsSection from '@/components/ClubsSection.vue';
import ActivitiesSection from '@/components/ActivitiesSection.vue';

// Componentes de modales
import ViewProfileModal from '@/components/modals/ViewProfileModal.vue';
import EditProfileModal from '@/components/modals/EditProfileModal.vue';
import SecurityModal from '@/components/modals/SecurityModal.vue';
import CreateActivityModal from '@/components/modals/CreateActivityModal.vue';
import CreateClubModal from '@/components/modals/CreateClubModal.vue'; // Importar el nuevo modal
import ProfilePictureUploadModal from '@/components/modals/ProfilePictureUploadModal.vue'; // Importar el nuevo modal de foto de perfil
import JoinClubModal from '@/components/modals/JoinClubModal.vue'; // Importar el nuevo modal de unirse a club

// Componente del nuevo Overlay para modales
import ModalOverlay from '@/components/ui/ModalOverlay.vue';

// Componentes de UI generales
import ToastNotification from '@/components/ui/ToastNotification.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

// AÑADIDO: Importamos los nuevos widgets que vamos a crear
import UpcomingEventsWidget from '@/components/widgets/UpcomingEventsWidget.vue';
import CalendarWidget from '@/components/widgets/CalendarWidget.vue';
import NotificationsWidget from '@/components/widgets/NotificationsWidget.vue';


// Sección Principal (Script Setup)
// =============================================================================

const userStore = useUserStore();
const authStore = useAuthStore();

// Desestructura las propiedades reactivas del store, incluyendo el getter `isAnyModalOpen`
// y el estado `user` y `loading`.
const {
  modals, toast, filteredClubs, showAllClubs, isAnyModalOpen, loading
} = storeToRefs(userStore);

const { toggleClubsView } = userStore;

const showCreateClubModal = ref(false); // Nuevo estado para controlar la visibilidad del modal

function openCreateClubModal() {
  showCreateClubModal.value = true;
}

function closeCreateClubModal() {
  showCreateClubModal.value = false;
  // Opcional: Recargar los clubes del usuario después de crear uno nuevo
  // userStore.fetchProfile(); // Ya no es necesario, authStore.currentUser se actualiza en el login/refresh
}

// Cargar datos del usuario al montar el componente
// La carga del perfil del usuario ya se maneja en useAuthStore.tryLoadTokenFromStorage
// al inicio de la aplicación. No es necesario volver a llamarlo aquí.

</script>

<template>
  <ModalOverlay v-if="isAnyModalOpen || showCreateClubModal">
    <ViewProfileModal v-if="modals.viewProfile" />
    <EditProfileModal v-if="modals.editProfile" />
    <SecurityModal    v-if="modals.security"     />
    <CreateActivityModal v-if="modals.createActivity" />
    <CreateClubModal v-if="showCreateClubModal" @close="closeCreateClubModal" @clubCreated="closeCreateClubModal" />
    <ProfilePictureUploadModal :visible="modals.profilePictureUpload" @close="userStore.closeAllModals()" />
    <JoinClubModal v-if="modals.joinClub" @close="userStore.closeAllModals()" />
  </ModalOverlay>

  <ToastNotification v-if="toast.show"
                     :message="toast.message"
                     :type="toast.type" />

  <main class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-screen-xl mx-auto">
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 space-y-10">
          <QuickActions />
          <BaseButton @click="openCreateClubModal" class="mb-4">Crear Nuevo Club</BaseButton>
          <ClubsSection
              :clubs="filteredClubs || []"
              :show-all-clubs="showAllClubs"
              @toggle-clubs-view="toggleClubsView"
          />
          <ActivitiesSection :activities="authStore.currentUser?.activities || []" />
        </div>

        <div class="lg:col-span-1 space-y-8">
          <UpcomingEventsWidget :activities="authStore.currentUser?.activities || []" />
          <CalendarWidget :activities="authStore.currentUser?.activities || []" />
          <NotificationsWidget :notifications="authStore.currentUser?.notifications || []" />
        </div>

      </div>
    </div>
  </main>
</template>

