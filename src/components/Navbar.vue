<template>
    <nav class="bg-primary text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Bloomskin</h1>
        <ul class="flex space-x-4">
          <li><router-link to="/" class="hover:underline">Inicio</router-link></li>
          <li><router-link to="/tienda" class="hover:underline">Tienda</router-link></li>
          <li><router-link to="/contacto" class="hover:underline">Contacto</router-link></li>
          <li><router-link to="/carrito" class="hover:underline">🛒 Carrito</router-link></li>
        </ul>
      </div>
    </nav>
</template>
  