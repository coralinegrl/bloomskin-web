<template>
    <div>
      <h1>Tienda Bloomskin</h1>
      <ul>
        <li v-for="producto in productos" :key="producto.id">
          {{ producto.nombre }} - ${{ producto.precio }}
          <button @click="agregarAlCarrito(producto)">Agregar</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        productos: [],
      };
    },
    async created() {
      const res = await axios.get("http://localhost:5000/productos");
      this.productos = res.data;
    },
    methods: {
      agregarAlCarrito(producto) {
        console.log("Producto agregado:", producto);
      },
    },
  };
</script>
  