import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IconKey } from '@/utils/icons'

/** Modelo de grupo */
interface Group {
    id: number
    name: string
    description: string
    members: number
    icon: IconKey
    isMember: boolean
}

/** Modelo de actividad */
interface Activity {
    id: number
    title: string
    date: string
    time: string
    location: string
    type: string
    status: 'confirmed' | 'pending'
}

export const useUserStore = defineStore('user', () => {
    /* ─── Estado principal ─── */
    const user = ref({
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
        ] as Group[],
        activities: [
            { id:1, title:'Hackathon 2023',            date:'2023-11-15', time:'09:00', location:'Edificio 3 – Aula 302', type:'competition', status:'pending'   },
            { id:2, title:'Reunión Club Programación', date:'2023-11-10', time:'14:00', location:'Biblioteca – Sala 4',   type:'meeting',     status:'confirmed' }
        ] as Activity[]
    })

    /* ─── UI State: modales, dropdown, toast ─── */
    const modals = ref({ viewProfile:false, editProfile:false, security:false })
    const showProfileDropdown = ref(false)
    const toast = ref<{ show:boolean; message:string; type:'success'|'error' }>({ show:false, message:'', type:'success' })

    /* ─── Grupos “ver más/menos” ─── */
    const showAllGroups = ref(false)
    const filteredGroups = computed(() =>
        showAllGroups.value
            ? user.value.groups
            : user.value.groups.filter(g => g.isMember)
    )
    function toggleGroupsView() {
        showAllGroups.value = !showAllGroups.value
    }

    /* ─── Acciones de modales ─── */
    function openModal(key: keyof typeof modals.value) {
        showProfileDropdown.value = false
        modals.value[key] = true
    }
    function closeModal(key: keyof typeof modals.value) {
        modals.value[key] = false
    }

    /* ─── Dropdown del avatar ─── */
    function toggleProfileDropdown() {
        showProfileDropdown.value = !showProfileDropdown.value
    }
    function closeProfileDropdown() {
        showProfileDropdown.value = false
    }

    /* ─── Toast ─── */
    function showToast(message:string, type:'success'|'error' = 'success') {
        toast.value = { show:true, message, type }
        setTimeout(() => (toast.value.show = false), 3000)
    }

    /* ─── Logout ─── */
    function logout() {
        closeProfileDropdown()
        showToast('Sesión cerrada correctamente')
        // aquí podrías limpiar sesión o redirigir
    }

    return {
        user, modals, showProfileDropdown, toast,
        showAllGroups, filteredGroups,

        openModal, closeModal,
        toggleProfileDropdown, closeProfileDropdown,
        toggleGroupsView, showToast,
        logout
    }
})
