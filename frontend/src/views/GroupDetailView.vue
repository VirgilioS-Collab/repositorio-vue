<script setup lang="ts">
import { onMounted, computed, watch } from 'vue';
import { useGroupStore } from '@/store/useGroupStore';
import { useMemberStore } from '@/store/useMemberStore';
import { useActivityStore } from '@/store/useActivityStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { RouterLink, useRoute } from 'vue-router';

const props = defineProps<{ id: string }>();
const route = useRoute();

const groupStore = useGroupStore();
const memberStore = useMemberStore();
const activityStore = useActivityStore();

const { details: group, loading: groupLoading, error: groupError, membershipStatus, joiningGroupId } = storeToRefs(groupStore);
const { items: members } = storeToRefs(memberStore);
const { items: activities } = storeToRefs(activityStore);

async function loadViewData(id: number) {
    if (isNaN(id)) return;
    await groupStore.fetchDetails(id);
    // Solo cargamos el resto si la carga principal fue exitosa
    if (groupStore.details) {
      memberStore.fetchAll(id, {});
      activityStore.fetchByGroup(id);
    }
}

onMounted(() => {
  loadViewData(Number(props.id));
});

watch(() => route.params.id, (newId) => {
    if (newId && route.name === 'GroupDetail') {
        loadViewData(Number(newId));
    }
}, { immediate: true });

const owner = computed(() => group.value?.owner);
const creationDate = computed(() => {
  if (!group.value?.creation_date) return '';
  return new Date(group.value.creation_date).toLocaleDateString('es-PA', { year: 'numeric', month: 'long' });
});

function handleJoinClick() {
  if (membershipStatus.value === 'not_member') {
    groupStore.requestToJoin(Number(props.id));
  }
}
</script>

<template>
  <div v-if="groupLoading" class="flex justify-center items-center h-96">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="groupError" class="p-8 text-center bg-red-50 max-w-2xl mx-auto rounded-lg">
    <LucideIcon name="alert-circle" :size="48" class="text-red-500 mx-auto" />
    <h3 class="mt-4 text-xl font-semibold text-red-800">Error al Cargar el Grupo</h3>
    <p class="mt-1 text-red-600">{{ groupError }}</p>
    <RouterLink to="/groups" class="mt-6 inline-block px-6 py-2 bg-primary text-white font-semibold rounded-lg">
        Volver a la lista de grupos
    </RouterLink>
  </div>
  
  <div v-else-if="group" class="bg-soft pb-10">
    <header class="relative mb-8">
      <div 
        class="h-48 md:h-64 bg-gray-500 rounded-b-3xl bg-cover bg-center shadow-inner" 
        :style="{ backgroundImage: `url(${group?.banner_url || ''})` }"
      >
        <div class="absolute inset-0 bg-black/40 rounded-b-3xl"></div>
      </div>
      <div class="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-16 gap-4 relative">
          <div class="w-32 h-32 bg-accent rounded-full border-4 border-soft flex items-center justify-center shrink-0 shadow-lg">
            <LucideIcon :name="group?.icon || 'users'" :size="64" class="text-primary"/>
          </div>
          <div class="flex-grow text-center sm:text-left pt-2 sm:pt-0 sm:pb-2">
            <h1 class="text-3xl lg:text-4xl font-bold text-darkText">{{ group?.group_name }}</h1>
            <p class="text-gray-500">{{ group?.group_category_name || 'Grupo de la comunidad' }} Alianza UTP</p>
          </div>
          <button 
              @click="handleJoinClick"
              :disabled="joiningGroupId === group?.group_id || membershipStatus !== 'not_member'"
              class="shrink-0 px-6 py-2.5 text-white font-semibold rounded-lg transition"
              :class="{
                'bg-primary hover:bg-primary-dark': membershipStatus === 'not_member',
                'bg-yellow-500 cursor-default': membershipStatus === 'pending',
                'bg-green-600 cursor-default': membershipStatus === 'member',
                'disabled:opacity-70 disabled:cursor-not-allowed': true
              }"
            >
            <LucideIcon v-if="joiningGroupId === group?.group_id" name="loader" :size="20" class="animate-spin" />
            <span v-else-if="membershipStatus === 'pending'">Solicitud Pendiente</span>
            <span v-else-if="membershipStatus === 'member'">Ya eres Miembro</span>
            <span v-else>Unirse al Grupo</span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-screen-lg mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-card border border-gray-200 p-6 rounded-xl shadow-sm">
          <h2 class="font-bold text-xl mb-3"><LucideIcon name="info" :size="20" class="text-accent inline-block mr-2" />Acerca de este grupo</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ group?.group_description || 'No hay descripción.' }}</p>
        </div>
        <div class="bg-card border border-gray-200 p-6 rounded-xl shadow-sm">
          <h2 class="font-bold text-xl mb-4"><LucideIcon name="calendar-check" :size="20" class="text-accent inline-block mr-2" />Próximas Actividades</h2>
          <div v-if="activities && activities.length > 0" class="space-y-3">
            <RouterLink v-for="act in activities" :key="act.activity_id" :to="{ name: 'ActivityDetail', params: { id: act.activity_id } }" class="p-3 rounded-lg hover:bg-soft flex justify-between items-center cursor-pointer transition-colors border">
              <div>
                <p class="font-semibold text-primary">{{ act.activity_name }}</p>
                <p class="text-sm text-gray-500">{{ new Date(act.activity_datetime).toLocaleDateString('es-PA', {dateStyle: 'long'}) }}</p>
              </div>
              <LucideIcon name="chevron-right" class="text-gray-400"/>
            </RouterLink>
          </div>
          <p v-else class="text-gray-500">Este grupo no tiene actividades próximas.</p>
        </div>
      </div>
      <div class="lg:col-span-1 space-y-8 sticky top-24">
        <div class="bg-card border border-gray-200 p-5 rounded-xl shadow-sm">
          <h3 class="font-bold text-lg mb-4">Miembros ({{ members?.length || 0 }})</h3>
          <div v-if="members && members.length > 0" class="flex flex-wrap gap-2">
            <div v-for="member in members" :key="member.user_id" :title="member.name" class="w-12 h-12">
                <img class="w-full h-full rounded-full ring-2 ring-white object-cover" :src="member.profile_photo_url || `https://i.pravatar.cc/48?u=${member.user_id}`" :alt="member.name">
            </div>
          </div>
           <p v-else class="text-sm text-gray-500">Sé el primer miembro.</p>
        </div>
        <div class="bg-card border border-gray-200 p-5 rounded-xl space-y-3 text-sm shadow-sm">
          <div class="flex justify-between items-center"><span class="font-semibold text-gray-600">Propietario:</span><span class="font-medium text-darkText flex items-center gap-2"><img v-if="owner?.profile_photo_url" :src="owner.profile_photo_url" class="w-6 h-6 rounded-full object-cover"/>{{ owner?.name || 'N/A' }}</span></div>
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Categoría:</span><span class="font-medium text-darkText">{{ group?.group_category_name || 'General' }}</span></div>
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Creado en:</span><span class="font-medium text-darkText">{{ creationDate }}</span></div>
        </div>
      </div>
    </main>
  </div>
</template>