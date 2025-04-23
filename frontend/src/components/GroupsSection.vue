<template>
  <section class="mb-10">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-[#E4B95B]">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Mis Grupos
      </h2>
      <button @click="$emit('toggle-groups-view')"
        class="text-sm bg-[#00205B] text-white px-3 py-1 rounded-md hover:bg-blue-700 transition">
        {{ showAllGroups ? 'Ver menos' : 'Ver más' }}
      </button>
    </div>

    <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="group in groups" :key="group.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        <div class="p-4 sm:p-5">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 rounded-full bg-[#00205B] flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#E4B95B]">
                <path :d="getGroupIcon(group.icon)" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-800 text-sm sm:text-base truncate">{{ group.name }}</h3>
              <span v-if="group.isMember"
                class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Miembro</span>
            </div>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 mb-3">{{ group.description }}</p>
          <div class="flex justify-between items-center text-xs sm:text-sm">
            <span class="text-gray-500">{{ group.members }} miembros</span>
            <button v-if="showAllGroups && !group.isMember"
              class="text-xs sm:text-sm bg-[#00205B] text-white px-2 sm:px-3 py-1 rounded-md hover:bg-blue-700 transition">
              Unirse
            </button>
            <span v-else-if="showAllGroups && group.isMember"
              class="text-xs text-green-600 font-medium">Ya eres miembro</span>
            <button v-else
              class="text-xs sm:text-sm bg-[#00205B] text-white px-2 sm:px-3 py-1 rounded-md hover:bg-blue-700 transition">
              Ver grupo
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  groups: Array,
  showAllGroups: Boolean
});

const getGroupIcon = (icon) => {
  const icons = {
    code: 'M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3',
    cpu: 'M18 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12z',
    award: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    database: 'M12 2C7.58 2 4 3.79 4 6v12c0 2.21 3.58 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4z',
    palette: 'M12 22c4.97 0 9-3.58 9-8 0-3.31-2.69-6-6-6a5 5 0 0 0-5 5H7c0-2.76 2.24-5 5-5a7 7 0 0 1 7 7c0 3.87-3.13 7-7 7z',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    smartphone: 'M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z',
    brain: 'M12 5v14M7 9a4 4 0 0 1 4-4M17 9a4 4 0 0 0-4-4'
  };

  return icons[icon] || icons['code'];
};
</script>
