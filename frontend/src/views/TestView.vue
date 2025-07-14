<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">🧪 Panel de Pruebas</h1>
      
      <div class="space-y-4">
        <button 
          @click="testBackendConnection"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          :disabled="loading"
        >
          🔗 Probar Conexión Backend
        </button>
        
        <button 
          @click="testLogin"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          :disabled="loading"
        >
          🔐 Probar Login (Sin Usuario)
        </button>
        
        <button 
          @click="testAuthStore"
          class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          :disabled="loading"
        >
          🏪 Probar Auth Store
        </button>
      </div>
      
      <div v-if="loading" class="mt-4 text-center">
        <p>⏳ Cargando...</p>
      </div>
      
      <div v-if="result" class="mt-4 p-4 rounded-lg" :class="result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        <h3 class="font-bold">{{ result.success ? '✅ Éxito' : '❌ Error' }}</h3>
        <p class="text-sm mt-1">{{ result.message }}</p>
        <pre v-if="result.data" class="text-xs mt-2 overflow-auto">{{ JSON.stringify(result.data, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'
import http from '@/services/http'

const loading = ref(false)
const result = ref<any>(null)
const authStore = useAuthStore()

async function testBackendConnection() {
  loading.value = true
  result.value = null
  
  try {
    const response = await http.get('/auth/me')
    result.value = {
      success: true,
      message: 'Backend respondió correctamente (esperado 401)',
      data: response.data
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      result.value = {
        success: true,
        message: 'Backend funcionando - 401 esperado (sin token)',
        data: error.response.data
      }
    } else {
      result.value = {
        success: false,
        message: 'Error de conexión con backend',
        data: error.message
      }
    }
  } finally {
    loading.value = false
  }
}

async function testLogin() {
  loading.value = true
  result.value = null
  
  try {
    await authStore.login({ email: 'test@test.com', password: 'test123' })
    result.value = {
      success: true,
      message: 'Login procesado (inesperado)',
      data: { isAuthenticated: authStore.isAuthenticated }
    }
  } catch (error: any) {
    result.value = {
      success: true,
      message: 'Login falló como esperado (sin usuario válido)',
      data: { 
        error: error.message,
        authError: authStore.authError,
        isAuthenticated: authStore.isAuthenticated
      }
    }
  } finally {
    loading.value = false
  }
}

async function testAuthStore() {
  loading.value = true
  result.value = null
  
  try {
    await authStore.tryLoadTokenFromStorage()
    result.value = {
      success: true,
      message: 'Auth Store inicializado correctamente',
      data: {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.currentUser,
        loading: authStore.isLoadingAuth,
        error: authStore.authError
      }
    }
  } catch (error: any) {
    result.value = {
      success: false,
      message: 'Error en Auth Store',
      data: error.message
    }
  } finally {
    loading.value = false
  }
}
</script>
