<script setup lang="ts">
/**
 * @file: src/views/club/FinanceView.vue
 * @description: Vista para la gestión financiera de un club.
 */
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFinanceStore } from '@/store/useFinanceStore';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/ui/LucideIcon.vue';
import BaseChart from '@/components/ui/BaseChart.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import type { TransactionDTO } from '@/services/dao/models/Admin';

const route = useRoute();
const financeStore = useFinanceStore();
const clubId = Number(route.params.id);

const { summary, transactions, loading } = storeToRefs(financeStore);

const showTransactionModal = ref(false);
const editingTransaction = ref<TransactionDTO | null>(null);

const filteredTransactions = computed(() => {
  // Implementar lógica de filtrado y búsqueda aquí si es necesario
  return transactions.value;
});

const historicalBalanceChartOption = computed(() => ({
  title: { text: 'Saldo Histórico', left: 'center', textStyle: { fontSize: 16 } },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: summary.value?.historical_dates || [] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Saldo', type: 'line', data: summary.value?.historical_balances || [] }
  ]
}));

function openCreateModal() {
  editingTransaction.value = { id: 0, date: new Date().toISOString().substring(0, 10), description: '', category: '', type: 'income', amount: 0 };
  showTransactionModal.value = true;
}

function openEditModal(transaction: TransactionDTO) {
  editingTransaction.value = { ...transaction };
  showTransactionModal.value = true;
}

function saveTransaction() {
  if (editingTransaction.value) {
    if (editingTransaction.value.id === 0) {
      financeStore.addTransaction(clubId, editingTransaction.value);
    } else {
      financeStore.updateTransaction(clubId, editingTransaction.value.id, editingTransaction.value);
    }
  }
  showTransactionModal.value = false;
  editingTransaction.value = null;
}

function deleteTransaction(transactionId: number) {
  if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
    financeStore.deleteTransaction(clubId, transactionId);
  }
}

function exportTransactionsToCSV() {
  const headers = ["Fecha", "Descripción", "Categoría", "Tipo", "Monto"];
  const rows = transactions.value.map(t => [
    new Date(t.date).toLocaleDateString('es-PA'),
    t.description,
    t.category,
    t.type === 'income' ? 'Ingreso' : 'Egreso',
    t.amount.toFixed(2)
  ]);

  let csvContent = headers.join(",") + "\n";
  rows.forEach(row => {
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'transacciones.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(() => {
  if (clubId) {
    financeStore.fetchSummary(clubId);
    financeStore.fetchTransactions(clubId);
  }
});
</script>

<template>
  <div class="space-y-8">
    <header class="flex justify-between items-center flex-wrap gap-4">
      <h2 class="text-2xl font-bold text-darkText">Gestión Financiera</h2>
      <div class="flex gap-2">
        <BaseButton @click="exportTransactionsToCSV" variant="secondary">
          <template #icon>
            <LucideIcon name="download" :size="18"/>
          </template>
          Exportar CSV
        </BaseButton>
        <BaseButton @click="openCreateModal">
          <template #icon>
            <LucideIcon name="plus" :size="18"/>
          </template>
          Agregar Transacción
        </BaseButton>
      </div>
    </header>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-card border border-gray-200 rounded-xl shadow-sm p-5">
        <h3 class="font-bold text-lg text-darkText mb-2">Ingresos Totales</h3>
        <p class="text-3xl font-extrabold text-green-600">${{ summary?.income?.toFixed(2) || '0.00' }}</p>
      </div>
      <div class="bg-card border border-gray-200 rounded-xl shadow-sm p-5">
        <h3 class="font-bold text-lg text-darkText mb-2">Egresos Totales</h3>
        <p class="text-3xl font-extrabold text-red-600">${{ summary?.expenses?.toFixed(2) || '0.00' }}</p>
      </div>
      <div class="bg-card border border-gray-200 rounded-xl shadow-sm p-5">
        <h3 class="font-bold text-lg text-darkText mb-2">Saldo Actual</h3>
        <p class="text-3xl font-extrabold text-blue-600">${{ summary?.balance?.toFixed(2) || '0.00' }}</p>
      </div>
    </section>

    <section class="bg-white p-6 rounded-xl shadow-sm border h-80 flex-grow">
      <BaseChart :option="historicalBalanceChartOption" />
    </section>

    <section class="bg-white p-6 rounded-xl shadow-sm border">
      <h3 class="text-lg font-bold text-darkText mb-4">Transacciones</h3>
      <div class="mb-4 flex flex-col md:flex-row gap-3">
        <input type="text" placeholder="Buscar transacción..." class="input-focus-effect flex-grow"/>
        <select class="input-focus-effect">
          <option>Todos los tipos</option>
          <option>Ingreso</option>
          <option>Egreso</option>
        </select>
        <select class="input-focus-effect">
          <option>Todas las categorías</option>
          <option>Cuotas</option>
          <option>Eventos</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading"><td colspan="6" class="text-center py-8">Cargando transacciones...</td></tr>
            <tr v-else-if="filteredTransactions.length === 0"><td colspan="6" class="text-center py-8">No hay transacciones.</td></tr>
            <tr v-else v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-soft">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ new Date(transaction.date).toLocaleDateString('es-PA') }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ transaction.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ transaction.category }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'">{{ transaction.type === 'income' ? 'Ingreso' : 'Egreso' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'">${{ transaction.amount.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openEditModal(transaction)" class="text-primary hover:text-primary-dark mr-3"><LucideIcon name="edit" :size="16"/></button>
                <button @click="deleteTransaction(transaction.id)" class="text-red-600 hover:text-red-800"><LucideIcon name="trash-2" :size="16"/></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal de Transacción -->
    <div v-if="showTransactionModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-bold mb-4">{{ editingTransaction?.id === 0 ? 'Agregar' : 'Editar' }} Transacción</h3>
          <div class="space-y-4" v-if="editingTransaction">
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha</label>
              <input type="date" v-model="editingTransaction.date" class="input-focus-effect w-full"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Descripción</label>
              <input type="text" v-model="editingTransaction.description" class="input-focus-effect w-full"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Categoría</label>
              <input type="text" v-model="editingTransaction.category" class="input-focus-effect w-full"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo</label>
              <select v-model="editingTransaction.type" class="input-focus-effect w-full">
                <option value="income">Ingreso</option>
                <option value="expense">Egreso</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Monto</label>
              <input type="number" v-model.number="editingTransaction.amount" class="input-focus-effect w-full"/>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 p-4 flex justify-end gap-3">
          <BaseButton @click="showTransactionModal = false" variant="secondary">Cancelar</BaseButton>
          <BaseButton @click="saveTransaction">Guardar</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>