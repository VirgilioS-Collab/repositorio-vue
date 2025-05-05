import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    /* ─────────── Estado principal ─────────── */
    const user = ref({
        name:  'María Pérez',
        role:  'Estudiante',
        email: 'maria@utp.ac.pa',
        career: 'Ingeniería en Sistemas',
        profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',

        groups: [
            { id:1, name:'Club de Programación',    description:'Software y algoritmos', members:24, icon:'code',   isMember:true  },
            { id:2, name:'Robótica UTP',            description:'Electrónica y mecatrónica', members:15, icon:'cpu',   isMember:true  },
            { id:3, name:'Seguridad Informática',   description:'Ciberseguridad y hacking',  members:20, icon:'shield',isMember:true  },
            { id:4, name:'Inteligencia Artificial', description:'Aprendizaje automático e IA', members:25, icon:'brain', isMember:false }
        ],

        activities: [
            { id:1, title:'Hackathon 2023',            date:'2023-11-15', time:'09:00', location:'Edificio 3 – Aula 302', type:'competition', status:'pending'   },
            { id:2, title:'Reunión Club Programación', date:'2023-11-10', time:'14:00', location:'Biblioteca – Sala 4',   type:'meeting',     status:'confirmed' }
        ]
    })

    /* ─────────── UI global (modales, toast) ─────────── */
    const modals = ref({ viewProfile:false, editProfile:false, security:false })
    type ModalKey = keyof typeof modals.value

    const toast = ref<{show:boolean; message:string; type:'success'|'error'}>({
        show:false, message:'', type:'success'
    })

    /* ─────────── Grupos (ver más / menos) ─────────── */
    const showAllGroups  = ref(false)
    const filteredGroups = computed(() =>
        showAllGroups.value ? user.value.groups
            : user.value.groups.filter(g => g.isMember)
    )
    function toggleGroupsView() { showAllGroups.value = !showAllGroups.value }

    /* ─────────── Acciones genéricas ─────────── */
    function openModal (m:ModalKey)  { modals.value[m] = true  }
    function closeModal(m:ModalKey)  { modals.value[m] = false }

    function showToast(message:string, type:'success'|'error'='success') {
        toast.value = { show:true, message, type }
        setTimeout(() => (toast.value.show = false), 3_000)
    }

    return {
        /* estado */
        user, modals, toast,
        showAllGroups, filteredGroups,
        /* acciones */
        openModal, closeModal, toggleGroupsView, showToast,
    }
})
