<template>
  <div>
    <h2>Productos</h2>
    <ul>
      <li v-for="producto in productos" :key="producto.id">{{ producto.nombre }}</li>
    </ul>
  </div>
</template>

<script>
import apiClient from '../services/api'

export default {
  data() {
    return {
      productos: [],
    };
  },
  created() {
    // Llama a la API cuando el componente se monta
    apiClient.get('/productos/')
      .then(response => {
        this.productos = response.data;
      })
      .catch(error => {
        console.error("Error al cargar productos:", error);
      });
  },
};
</script>