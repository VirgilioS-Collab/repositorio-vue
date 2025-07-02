<script setup lang="ts">
/**
 * @file src/views/GroupDetailView.vue
 * @description Muestra el perfil completo de un grupo, incluyendo su
 * información, miembros y actividades.
 */
import { onMounted, computed } from 'vue';
import { useGroupStore } from '@/store/useGroupStore';
import { useMemberStore } from '@/store/useMemberStore';
import { useActivityStore } from '@/store/useActivityStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';

const props = defineProps<{ id: string }>();

const groupStore = useGroupStore();
const memberStore = useMemberStore();
const activityStore = useActivityStore();

// Hacemos el estado reactivo para la UI
const { details: group, loading: groupLoading } = storeToRefs(groupStore);
const { items: members, loading: membersLoading } = storeToRefs(memberStore);
const { items: activities, loading: activitiesLoading } = storeToRefs(activityStore);

// Al montar el componente, buscamos toda la información necesaria
onMounted(() => {
  // Asumimos que estas acciones existen o las crearemos
  groupStore.fetchDetails(Number(props.id));
  // Reemplaza estas llamadas si la lógica es diferente (ej. por ID de grupo)
  // memberStore.fetchByGroup(Number(props.id)); 
  // activityStore.fetchByGroup(Number(props.id));
});

// Busca al propietario dentro de la lista de miembros cargada
const owner = computed(() => {
    if (!group.value || members.value.length === 0) return null;
    return members.value.find(m => m.user_id === group.value?.group_owner_id);
});
</script>

<template>
  <div v-if="group && !groupLoading" class="p-4 sm:p-6 lg:p-8">
    <header class="mb-8">
      <div class="h-40 bg-gray-200 rounded-xl flex items-center justify-center bg-cover bg-center" style="background-image: url('https://via.placeholder.com/1200x200/00205B/FFFFFF?text=Banner+del+Grupo')">
        </div>
      <div class="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:ml-8 gap-4">
        <div class="w-24 h-24 bg-accent rounded-full border-4 border-white flex items-center justify-center shrink-0">
          <LucideIcon name="users" :size="48" class="text-primary"/>
        </div>
        <div class="flex-grow text-center sm:text-left">
          <h1 class="text-3xl font-bold text-darkText">{{ group.group_name }}</h1>
          <p class="text-gray-500">Grupo de la comunidad Alianza UTP</p>
        </div>
        <button class="px-6 py-2 text-white font-semibold bg-primary rounded-lg hover:bg-primary-dark transition shrink-0">
          Unirse al Grupo
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-card border border-gray-200 p-6 rounded-xl">
          <h2 class="font-bold text-xl mb-3">Acerca de este grupo</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ group.group_description || 'No hay descripción disponible.' }}</p>
        </div>
        <div class="bg-card border border-gray-200 p-6 rounded-xl">
          <h2 class="font-bold text-xl mb-4">Próximas Actividades del Grupo</h2>
          <div v-if="activities.length > 0" class="space-y-3">
            <div v-for="act in activities" :key="act.activity_id" class="p-3 rounded-md hover:bg-gray-50 flex justify-between items-center cursor-pointer">
              <div>
                <p class="font-semibold">{{ act.activity_name }}</p>
                <p class="text-sm text-gray-500">{{ new Date(act.start_time).toLocaleDateString('es-PA') }}</p>
              </div>
              <LucideIcon name="chevron-right" class="text-gray-400"/>
            </div>
          </div>
          <p v-else class="text-gray-500">Este grupo no tiene actividades próximas.</p>
        </div>
      </div>
      <div class="lg:col-span-1 space-y-8">
        <div class="bg-card border border-gray-200 p-5 rounded-xl">
          <h3 class="font-bold text-lg mb-3">Miembros ({{ members.length }})</h3>
          <div v-if="members.length > 0" class="flex -space-x-2 overflow-hidden">
            <img v-for="member in members.slice(0, 7)" :key="member.user_id" class="inline-block h-10 w-10 rounded-full ring-2 ring-white" :src="`https://i.pravatar.cc/40?u=${member.user_id}`" alt="Avatar">
            <div v-if="members.length > 7" class="h-10 w-10 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center font-semibold text-sm">+{{ members.length - 7 }}</div>
          </div>
           <p v-else class="text-sm text-gray-500">Sé el primer miembro.</p>
        </div>
        <div class="bg-card border border-gray-200 p-5 rounded-xl space-y-3 text-sm">
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Propietario:</span><span>{{ owner?.name || 'No disponible' }}</span></div>
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Categoría:</span><span>Académico</span></div>
          <div class="flex justify-between"><span class="font-semibold text-gray-600">Creado en:</span><span>Enero 2024</span></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-16">Cargando detalles del grupo...</div>
</template>