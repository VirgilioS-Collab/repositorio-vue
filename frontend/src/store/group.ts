import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Group { id:number; name:string; description:string; members:number; icon:string; isMember:boolean }
interface Activity { id:number; title:string; date:string; time:string; location:string; type:string; status:'confirmed'|'pending' }

export const useGroupStore = defineStore('group', () => {
    const groups = ref<Group[]>([
        { id:1, name:'Club de Programación', description:'Software y algoritmos', members:24, icon:'code', isMember:true },
        // …
    ])

    const activities = ref<Activity[]>([
        { id:1, title:'Hackathon 2023', date:'2023-11-15', time:'09:00', location:'Edificio 3 – Aula 302', type:'competition', status:'pending' },
        // …
    ])

    const myGroups = computed(() => groups.value.filter(g => g.isMember))

    function joinGroup(id: number) {
        const g = groups.value.find(g=>g.id===id)
        if (g) g.isMember = true
    }

    return { groups, activities, myGroups, joinGroup }
})
