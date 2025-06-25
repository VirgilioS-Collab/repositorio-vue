<script setup lang="ts">
/**
 * @file src/views/GroupDetailView.vue
 * @description Muestra el perfil completo de un grupo, incluyendo su
 * información, miembros y actividades.
 * - MODIFICADO: Ahora utiliza el getter `membershipStatus` para mostrar un botón contextual.
 * - MODIFICADO: Dispara la acción `requestToJoin` al hacer clic en el botón.
 * - AÑADIDO: Muestra información más detallada como la categoría y fecha de creación.
 * - AÑADIDO: Muestra un estado de carga y error más robusto.
 */
import { onMounted, computed } from 'vue';
import { useGroupStore } from '@/store/useGroupStore';
import { useMemberStore } from '@/store/useMemberStore';
import { useActivityStore } from '@/store/useActivityStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { RouterLink } from 'vue-router';

const props = defineProps<{ id: string }>();

const groupStore = useGroupStore();
const memberStore = useMemberStore();
const activityStore = useActivityStore();

const { details: group, loading: groupLoading, error: groupError, membershipStatus } = storeToRefs(groupStore);
const { items: members, loading: membersLoading } = storeToRefs(memberStore);
const { items: activities, loading: activitiesLoading } = storeToRefs(activityStore);

onMounted(() => {
  const groupId = Number(props.id);
  groupStore.fetchDetails(groupId);
  // memberStore.fetchByGroup(groupId); // Asumiendo que esta acción existe
  // activityStore.fetchByGroup(groupId); // Asumiendo que esta acción existe
});

const owner = computed(() => {
    if (!group.value || !group.value.owner) return null;
    return group.value.owner;
});

const creationDate = computed(() => {
  if (!group.value?.creation_date) return 'No disponible';
  return new Date(group.value.creation_date).toLocaleDateString('es-PA', {
    year: 'numeric',
    month: 'long'
  });
});

function handleJoinClick() {
  if (membershipStatus.value === 'not_member') {
    groupStore.requestToJoin(Number(props.id));
  }
}
</script>

<template>
  <div v-if="group && !groupLoading" class="p-4 sm:p-6 lg:p-8">
    <header class="mb-8">
      <div 
        class="h-48 md:h-64 bg-gray-300 rounded-2xl flex items-center justify-center bg-cover bg-center shadow-inner" 
        :style="{ backgroundImage: `url(${group.banner_url || 'https://via.placeholder.com/1200x250/00205B/FFFFFF?text=Banner+del+Grupo'})` }"
      >
      </div>
      <div class="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:ml-8 gap-4">
        <div class="w-32 h-32 bg-accent rounded-full border-4 border-soft flex items-center justify-center shrink-0 shadow-lg">
          <LucideIcon :name="group.icon || 'users'" :size="64" class="text-primary"/>
        </div>
        <div class="flex-grow text-center sm:text-left pt-4 sm:pt-0">
          <h1 class="text-3xl lg:text-4xl font-bold text-darkText">{{ group.group_name }}</h1>
          <p class="text-gray-500">{{ group.group_category_name || 'Grupo de la comunidad' }} Alianza UTP</p>
        </div>
        <button 
            @click="handleJoinClick"
            :disabled="membershipStatus !== 'not_member' || groupLoading"
            class="px-6 py-2.5 text-white font-semibold rounded-lg transition shrink-0 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            :class="{
              'bg-primary hover:bg-primary-dark': membershipStatus === 'not_member',
              'bg-yellow-500': membershipStatus === 'pending',
              'bg-green-600': membershipStatus === 'member'
            }"
          >
          <span v-if="membershipStatus === 'not_member'">Unirse al Grupo</span>
          <span v-if="membershipStatus === 'pending'">Solicitud Pendiente</span>
          <span v-if="membershipStatus === 'member'">Ya eres Miembro</span>
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-card border border-gray-200 p-6 rounded-xl shadow-sm">
          <h2 class="font-bold text-xl mb-3 flex items-center gap-2"><LucideIcon name="info" :size="20" class="text-accent" />Acerca de este grupo</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ group.group_description || 'No hay descripción disponible.' }}</p>
        </div>
        <div class="bg-card border border-gray-200 p-6 rounded-xl shadow-sm">
          <h2 class="font-bold text-xl mb-4 flex items-center gap-2"><LucideIcon name="calendar-check" :size="20" class="text-accent" />Próximas Actividades del Grupo</h2>
          <div v-if="activities.length > 0" class="space-y-3">
            <RouterLink v-for="act in activities" :key="act.activity_id" :to="{ name: 'ActivityDetail', params: { id: act.activity_id } }" class="p-3 rounded-md hover:bg-soft flex justify-between items-center cursor-pointer transition-colors">
              <div>
                <p class="font-semibold text-primary">{{ act.activity_name }}</p>
                <p class="text-sm text-gray-500">{{ new Date(act.start_time).toLocaleDateString('es-PA') }}</p>
              </div>
              <LucideIcon name="chevron-right" class="text-gray-400"/>
            </RouterLink>
          </div>
          <p v-else class="text-gray-500">Este grupo no tiene actividades próximas.</p>
        </div>
      </div>
      <div class="lg:col-span-1 space-y-8">
        <div class="bg-card border border-gray-200 p-5 rounded-xl shadow-sm">
          <h3 class="font-bold text-lg mb-3">Miembros ({{ members.length }})</h3>
          <div v-if="members.length > 0" class="flex -space-x-2 overflow-hidden">
            <img v-for="member in members.slice(0, 7)" :key="member.user_id" class="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" :src="member.profile_photo_url || `https://i.pravatar.cc/40?u=${member.user_id}`" :alt="member.name">
            <div v-if="members.length > 7" class="h-10 w-10 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center font-semibold text-sm">+{{ members.length - 7 }}</div>
          </div>
           <p v-else class="text-sm text-gray-500">Sé el primer miembro.</p>
        </div>
        <div class="bg-card border border-gray-200 p-5 rounded-xl space-y-3 text-sm shadow-sm">
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Propietario:</span><span class="font-medium text-darkText">{{ owner?.name || 'No disponible' }}</span></div>
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Categoría:</span><span class="font-medium text-darkText">{{ group.group_category_name || 'General' }}</span></div>
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Creado en:</span><span class="font-medium text-darkText">{{ creationDate }}</span></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="groupLoading" class="text-center p-16">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
    <p class="mt-4 text-gray-500">Cargando detalles del grupo...</p>
  </div>
   <div v-else-if="groupError" class="text-center p-16 bg-red-50 rounded-lg">
    <LucideIcon name="alert-triangle" :size="48" class="text-red-500 mx-auto" />
    <h3 class="mt-4 text-xl font-semibold text-red-800">Error al Cargar</h3>
    <p class="mt-1 text-red-600">{{ groupError }}</p>
  </div>
</template>