<script setup lang="ts">
/**
 * @file src/components/widgets/CalendarWidget.vue
 * @description Widget de calendario estilo heatmap que muestra las actividades del usuario con iconos y colores.
 */
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ActivityDTO } from '@/services/dao/models/Activity';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import { NAME_ACTIVITY_DETAIL } from '@/constants/routes';

const props = defineProps<{
  activities: ActivityDTO[] | undefined;
}>();

const router = useRouter();
const currentDate = ref(new Date());

// Función para obtener el primer día del mes
const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Función para obtener el último día del mes
const getLastDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// Función para obtener los días del calendario (incluyendo días del mes anterior y siguiente)
const getCalendarDays = computed(() => {
  const firstDay = getFirstDayOfMonth(currentDate.value);
  const lastDay = getLastDayOfMonth(currentDate.value);
  
  // Obtener el primer lunes de la semana que contiene el primer día del mes
  const startDate = new Date(firstDay);
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 0=domingo, 1=lunes
  startDate.setDate(firstDay.getDate() - startDayOfWeek);
  
  // Generar exactamente 42 días (6 semanas x 7 días) para un grid completo
  const days = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
});

// Función para obtener actividades de un día específico
const getActivitiesForDay = (day: Date) => {
  if (!props.activities) return [];
  
  return props.activities.filter(activity => {
    const activityDate = new Date(activity.schedules?.[0]?.start_date || '');
    return activityDate.toDateString() === day.toDateString();
  });
};

// Función para obtener el icono basado en el tipo de actividad
const getActivityIcon = (activity: ActivityDTO) => {
  const type = activity.ga_activity_type?.toLowerCase() || '';
  
  if (type.includes('sport') || type.includes('deportiv')) return 'trophy';
  if (type.includes('cultural') || type.includes('art') || type.includes('workshop')) return 'palette';
  if (type.includes('meeting') || type.includes('academic') || type.includes('seminar')) return 'graduation-cap';
  if (type.includes('social') || type.includes('party') || type.includes('event')) return 'users';
  if (type.includes('hackaton') || type.includes('tech') || type.includes('coding')) return 'code';
  
  return 'calendar';
};

// Función para obtener el color basado en el tipo de actividad
const getActivityColor = (activity: ActivityDTO) => {
  const type = activity.ga_activity_type?.toLowerCase() || '';
  
  if (type.includes('sport') || type.includes('deportiv')) return 'text-green-500';
  if (type.includes('cultural') || type.includes('art') || type.includes('workshop')) return 'text-purple-500';
  if (type.includes('meeting') || type.includes('academic') || type.includes('seminar')) return 'text-blue-500';
  if (type.includes('social') || type.includes('party') || type.includes('event')) return 'text-pink-500';
  if (type.includes('hackaton') || type.includes('tech') || type.includes('coding')) return 'text-orange-500';
  
  return 'text-gray-500';
};

// Función para navegar entre meses
const navigateMonth = (direction: 'prev' | 'next') => {
  const newDate = new Date(currentDate.value);
  if (direction === 'prev') {
    newDate.setMonth(newDate.getMonth() - 1);
  } else {
    newDate.setMonth(newDate.getMonth() + 1);
  }
  currentDate.value = newDate;
};

// Función para formatear el mes y año
const formatMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });
});

// Función para verificar si un día está en el mes actual
const isCurrentMonth = (day: Date) => {
  return day.getMonth() === currentDate.value.getMonth();
};

// Función para verificar si un día es hoy
const isToday = (day: Date) => {
  const today = new Date();
  return day.toDateString() === today.toDateString();
};

const goToActivityDetails = (activityId: number) => {
  router.push({ name: NAME_ACTIVITY_DETAIL, params: { id: activityId } });
};
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
    <h3 class="text-xl font-bold text-darkText mb-4 text-center">Calendario de Actividades</h3>
    <!-- Header del calendario -->
    <div class="flex flex-col items-center mb-6">
      <div class="flex items-center justify-between w-full">
        <!-- Navegación de mes -->
        <button 
          @click="navigateMonth('prev')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LucideIcon name="chevron-left" :size="20" class="text-gray-600"/>
        </button>
        
        <h4 class="font-semibold text-lg text-gray-700 capitalize">
          {{ formatMonthYear }}
        </h4>
        
        <button 
          @click="navigateMonth('next')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LucideIcon name="chevron-right" :size="20" class="text-gray-600"/>
        </button>
      </div>
    </div>

    <!-- Días de la semana -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div 
        v-for="day in ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']" 
        :key="day"
        class="text-center text-xs font-medium text-gray-500 py-1"
      >
        {{ day }}
      </div>
    </div>

    <!-- Grid del calendario -->
    <div class="grid grid-cols-7 grid-rows-6 gap-0 border border-gray-200 rounded-lg overflow-hidden">
      <div
        v-for="day in getCalendarDays"
        :key="day.toISOString()"
        class="relative border-r border-b border-gray-100 transition-all hover:bg-gray-50 last:border-r-0"
        :class="{
          'bg-gray-50': !isCurrentMonth(day),
          'bg-blue-50': isToday(day),
          'opacity-50': !isCurrentMonth(day),
          'cursor-pointer': getActivitiesForDay(day).length > 0
        }"
        style="min-height: 40px;"
        @click="getActivitiesForDay(day).length > 0 && goToActivityDetails(getActivitiesForDay(day)[0].activity_id)"
      >
        <!-- Número del día -->
        <div 
          class="w-full h-full flex items-center justify-center text-sm font-medium relative p-2"
          :class="{
            'text-gray-400': !isCurrentMonth(day),
            'text-blue-600 font-bold': isToday(day),
            'text-gray-700': isCurrentMonth(day) && !isToday(day)
          }"
        >
          {{ day.getDate() }}
          
          <!-- Indicador de actividad con icono de pin y tooltip -->
          <div 
            v-if="getActivitiesForDay(day).length > 0"
            class="absolute bottom-1 right-1"
            :title="getActivitiesForDay(day).map(a => a.ga_activity_name).join(', ')"
          >
            <LucideIcon name="map-pin" :size="16" class="text-primary" />
          </div>
        </div>
      </div>
    </div>

    
  </div>
</template>