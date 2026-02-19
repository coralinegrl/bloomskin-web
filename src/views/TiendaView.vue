<template>
  <div class="site-shell space-y-6">
    <section class="rounded-3xl border border-clay bg-soft px-6 py-7 shadow-soft md:px-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="space-y-2">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-rose">Catalogo Bloomskin</p>
          <h1 class="font-display text-3xl font-semibold text-ink md:text-4xl">Tienda</h1>
          <p class="max-w-2xl text-sm text-ink/70 md:text-base">
            Vista cliente para explorar productos y simular compra.
          </p>
        </div>
        <p class="rounded-xl border border-ink/20 bg-white/40 px-4 py-2 text-sm font-semibold text-ink">
          Carrito: {{ carrito }}
        </p>
      </div>
    </section>

    <section>
      <p v-if="feedback" class="mb-4 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-700">
        {{ feedback }}
      </p>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="producto in productos"
          :key="producto.id"
          class="flex h-full flex-col rounded-2xl border border-clay bg-soft p-4 shadow-soft"
        >
          <img
            :src="producto.imagen"
            :alt="producto.nombre"
            width="300"
            height="300"
            loading="lazy"
            class="h-44 w-full rounded-xl object-cover"
          />
          <div class="mt-3 flex flex-1 flex-col gap-2">
            <h2 class="text-lg font-semibold text-ink">{{ producto.nombre }}</h2>
            <p class="text-sm text-ink/65">{{ producto.descripcion }}</p>
            <p class="font-display text-lg font-semibold text-rose">{{ formatPrice(producto.precio) }}</p>
            <p class="text-xs font-semibold uppercase tracking-wide text-ink/50">Stock: {{ producto.stock }}</p>
            <button
              type="button"
              class="mt-auto rounded-xl px-4 py-2 text-sm font-semibold text-soft transition"
              :class="producto.stock > 0 ? 'bg-ink hover:bg-rose' : 'bg-ink/35 cursor-not-allowed'"
              :disabled="producto.stock < 1"
              @click="agregarAlCarrito(producto)"
            >
              {{ producto.stock > 0 ? "Agregar al carrito" : "Sin stock" }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import { useCatalog } from "../composables/useCatalog";

export default {
  data() {
    return {
      carrito: 0,
      feedback: "",
      catalog: useCatalog(),
    };
  },
  computed: {
    productos() {
      return this.catalog.state.products;
    },
  },
  created() {
    this.catalog.fetchProducts();
  },
  methods: {
    agregarAlCarrito(producto) {
      if (producto.stock < 1) {
        this.feedback = `${producto.nombre} no tiene stock disponible.`;
        return;
      }

      this.carrito += 1;
      console.log("Producto agregado:", producto);
      this.feedback = `${producto.nombre} agregado al carrito.`;
    },
    formatPrice(value) {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
};
</script>
