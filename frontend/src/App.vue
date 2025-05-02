<!--
  Componente raíz de la SPA “Agenda Academia”.
  ▸ Mantiene el estado global (usuario, grupos, actividades, modales, toast)
  ▸ Orquesta los sub-componentes mediante props / emits
  ▸ Ya NO usa el CDN de Lucide; los iconos los resuelve el wrapper <LucideIcon>
-->

<script setup lang="ts">
import { ref, computed } from 'vue'

/* ── Componentes ───────────────────────────────────────────── */
import AppNavbar         from '@/components/AppNavbar.vue'
import ViewProfileModal  from '@/components/modals/ViewProfileModal.vue'
import EditProfileModal  from '@/components/modals/EditProfileModal.vue'
import SecurityModal     from '@/components/modals/SecurityModal.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
import QuickActions      from '@/components/QuickActions.vue'
import GroupsSection     from '@/components/GroupsSection.vue'
import ActivitiesSection from '@/components/ActivitiesSection.vue'

/* ── Modelos de datos (solo por tipado) ─────────────────────── */
interface Group     { id:number; name:string; description:string; members:number; icon:string; isMember:boolean }
interface Activity  { id:number; title:string; date:string; time:string; location:string; type:string; status:'confirmed'|'pending' }
interface User      { name:string; role:string; email:string; career:string; profileImage:string; groups:Group[]; activities:Activity[] }

/* Estado principal (migrarse a Pinia más adelante) */
const user = ref<User>({
  name: 'María Pérez',
  role: 'Estudiante',
  email: 'maria.perez@utp.ac.pa',
  career: 'Ingeniería en Sistemas',
  profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  groups: [
    { id:1, name:'Club de Programación',    description:'Software y algoritmos',       members:24, icon:'code',   isMember:true  },
    { id:2, name:'Robótica UTP',            description:'Electrónica y mecatrónica',   members:15, icon:'cpu',    isMember:true  },
    { id:3, name:'Seguridad Informática',   description:'Ciberseguridad y hacking',    members:20, icon:'shield', isMember:true  },
    { id:4, name:'Inteligencia Artificial', description:'Aprendizaje automático e IA', members:25, icon:'brain',  isMember:false }
  ],
  activities: [
    { id:1, title:'Hackathon 2023',            date:'2023-11-15', time:'09:00', location:'Edificio 3 – Aula 302', type:'competition', status:'pending'   },
    { id:2, title:'Reunión Club Programación', date:'2023-11-10', time:'14:00', location:'Biblioteca – Sala 4',   type:'meeting',     status:'confirmed' }
  ]
})

/* ── Dropdown de perfil ─────────────────────────────────────── */
const showProfileDropdown = ref(false)
function toggleProfileDropdown () { showProfileDropdown.value = !showProfileDropdown.value }

/* ── Modales ─────────────────────────────────────────────────── */
const modals = ref({ viewProfile:false, editProfile:false, security:false })
type ModalKey = keyof typeof modals.value
function openModal (m:ModalKey) { showProfileDropdown.value = false; modals.value[m] = true }
function closeModal(m:ModalKey) {                               modals.value[m] = false }

/* ── Toast ───────────────────────────────────────────────────── */
const toast = ref<{show:boolean; message:string; type:'success'|'error'}>({ show:false, message:'', type:'success' })
function showToast (msg:string, type:'success'|'error'='success') {
  toast.value = { show:true, message:msg, type }
  setTimeout(() => (toast.value.show = false), 3_000)
}

/* ── Callbacks de modales ───────────────────────────────────── */
function cancelEditProfile() { closeModal('editProfile'); showToast('Cambios descartados') }
function saveEditProfile  () { closeModal('editProfile'); showToast('Información personal actualizada') }

const securityData = ref({ currentPassword:'', newPassword:'', confirmPassword:'' })
function cancelSecurity() {
  securityData.value = { currentPassword:'', newPassword:'', confirmPassword:'' }
  closeModal('security'); showToast('Cambios descartados')
}
function saveSecurity() {
  if (securityData.value.newPassword !== securityData.value.confirmPassword) {
    showToast('Las contraseñas no coinciden', 'error'); return
  }
  securityData.value = { currentPassword:'', newPassword:'', confirmPassword:'' }
  closeModal('security'); showToast('Configuración de seguridad actualizada')
}

/* ── Logout ─────────────────────────────────────────────────── */
function logout() { showProfileDropdown.value = false; showToast('Sesión cerrada correctamente') }

/* ── Grupos: “ver más / ver menos” */
const showAllGroups  = ref(false)
function toggleGroupsView() { showAllGroups.value = !showAllGroups.value }
const filteredGroups = computed(() =>
    showAllGroups.value ? user.value.groups : user.value.groups.filter(g => g.isMember)
)
</script>

<template>
  <!-- Barra superior -->
  <AppNavbar
      :user="user"
      :showProfileDropdown="showProfileDropdown"
      @toggleProfileDropdown="toggleProfileDropdown"
      @openModal="openModal"
      @logout="logout"
  />

  <!-- Modales -->
  <ViewProfileModal v-if="modals.viewProfile" :user="user" @close="closeModal('viewProfile')" />
  <EditProfileModal v-if="modals.editProfile" :user="user" @cancel="cancelEditProfile" @save="saveEditProfile" />
  <SecurityModal    v-if="modals.security"    :security="securityData" @cancel="cancelSecurity" @save="saveSecurity" />

  <!-- Toast -->
  <ToastNotification v-if="toast.show" :message="toast.message" :type="toast.type" />

  <!-- Contenido principal -->
  <main class="pt-20 pb-16">
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

<!-- Estilos globales opcionales (Tailwind cubre la mayoría de casos) -->
<style>
</style>
