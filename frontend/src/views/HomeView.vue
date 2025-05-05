<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/useUserStore'
import QuickActions      from '@/components/QuickActions.vue'
import GroupsSection     from '@/components/GroupsSection.vue'
import ActivitiesSection from '@/components/ActivitiesSection.vue'
import ViewProfileModal  from '@/components/modals/ViewProfileModal.vue'
import EditProfileModal  from '@/components/modals/EditProfileModal.vue'
import SecurityModal     from '@/components/modals/SecurityModal.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'

const store = useUserStore()
const {
  user, modals, toast, filteredGroups, showAllGroups
} = storeToRefs(store)

const { toggleGroupsView } = store
</script>

<template>
  <!-- Modales globales -->
  <ViewProfileModal v-if="modals.viewProfile" />
  <EditProfileModal v-if="modals.editProfile" />
  <SecurityModal    v-if="modals.security"    />

  <!-- Toast -->
  <ToastNotification v-if="toast.show"
                     :message="toast.message"
                     :type="toast.type" />

  <!-- Contenido principal -->
  <main class="pt-8 pb-16">
<div class="max-w-screen-lg mx-auto px-4">
      <QuickActions />

      <GroupsSection
          :groups="filteredGroups"
          :show-all-groups="showAllGroups"
          @toggle-groups-view="toggleGroupsView"
      />

      <ActivitiesSection :activities="user.activities.slice(0, 5)" />
    </div>
  </main>
</template>
