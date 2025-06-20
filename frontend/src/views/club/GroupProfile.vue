<template>
  <div class="p-8">
    <div v-if="group">
      <h1 class="text-3xl font-bold mb-4">{{ group.g_group_name }}</h1>
      <p class="text-gray-600 mb-4">{{ group.g_group_description }}</p>
      <p class="text-gray-800">
        <span class="font-semibold">Miembros:</span> {{ memberCount }}
      </p>
      <div class="mt-6">
        <h2 class="text-2xl font-bold mb-4">Actividades Recientes</h2>
        <ul>
          <li
            v-for="activity in activities"
            :key="activity.activity_id"
            class="mb-2"
          >
            <router-link
              :to="{
                name: 'club-activities',
                params: { id: group.group_id },
              }"
              class="text-blue-500 hover:underline"
              >{{ activity.ga_activity_name }}</router-link
            >
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>Cargando...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGroupStore } from "@/store/useGroupStore";
import { useActivityStore } from "@/store/useActivityStore";
import { useMemberStore } from "@/store/useMemberStore";
import type { GroupDTO } from "@/services/dao/models/Group";
import type { ActivityDTO } from "@/services/dao/models/Activity";

const route = useRoute();
const groupStore = useGroupStore();
const activityStore = useActivityStore();
const memberStore = useMemberStore();

const group = ref<GroupDTO | null>(null);
const activities = ref<ActivityDTO[]>([]);
const memberCount = ref(0);

onMounted(async () => {
  const groupId = Number(route.params.id);
  if (groupId) {
    await groupStore.fetchById(groupId);
    group.value = groupStore.details;

    if (group.value) {
      await activityStore.fetchAll(group.value.group_id);
      activities.value = activityStore.items;

      await memberStore.fetchAll(group.value.group_id);
      memberCount.value = memberStore.items.length;
    }
  }
});
</script>