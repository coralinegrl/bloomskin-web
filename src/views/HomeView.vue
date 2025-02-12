<template>
  <div class="bg-background min-h-screen">
    <section class="relative w-full h-[400px] flex items-center justify-center bg-secondary text-white text-center text-3xl font-bold">
      🌸 Bienvenidos a Bloomskin 🌸
    </section>

    <section class="py-10 text-center">
      <h2 class="text-2xl font-semibold text-primary">✨ Productos Destacados ✨</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div v-for="producto in productos" :key="producto.id" class="bg-white p-4 rounded-lg shadow-md">
          <img :src="producto.imagen" alt="producto" class="w-full h-40 object-cover rounded-lg">
          <h3 class="mt-2 text-lg font-semibold">{{ producto.nombre }}</h3>
          <p class="text-secondary font-bold">${{ producto.precio }}</p>
          <button class="mt-2 bg-primary text-white py-1 px-3 rounded hover:bg-pink-600">Añadir al carrito</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productos: [
        { id: 1, nombre: "Limpiador Facial", precio: 15000, imagen: "https://via.placeholder.com/150" },
        { id: 2, nombre: "Tónico Hidratante", precio: 12000, imagen: "https://via.placeholder.com/150" },
      ],
    };
  },
};
</script>
