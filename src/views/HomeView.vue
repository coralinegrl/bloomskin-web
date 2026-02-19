<template>
  <div class="site-shell space-y-10 md:space-y-16">
    <section
      class="relative overflow-hidden rounded-3xl border border-clay/80 bg-gradient-to-br from-peach/50 via-soft to-rose/30 px-6 py-12 shadow-soft md:px-10 md:py-16"
    >
      <div class="absolute -right-20 -top-16 h-52 w-52 rounded-full bg-rose/20 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-peach/30 blur-3xl"></div>

      <div class="relative max-w-2xl space-y-6 animate-fade-up">
        <p class="text-xs font-bold uppercase tracking-[0.22em] text-rose">Skincare Studio</p>
        <h1 class="font-display text-4xl font-bold leading-tight text-ink md:text-6xl">
          Rutina real para una piel sana y luminosa
        </h1>
        <p class="text-sm leading-relaxed text-ink/80 md:text-lg">
          Productos efectivos, formulas suaves y una experiencia de compra clara. Bloomskin combina ciencia y estetica para cuidar tu piel todos los dias.
        </p>
        <div class="flex flex-wrap gap-3">
          <router-link
            to="/tienda"
            class="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-soft transition duration-200 hover:translate-y-[-1px] hover:bg-rose"
          >
            Ver tienda
          </router-link>
          <router-link
            to="/pago"
            class="rounded-xl border border-ink/20 bg-soft/70 px-5 py-3 text-sm font-semibold text-ink transition duration-200 hover:border-ink/35"
          >
            Ver metodo de pago
          </router-link>
        </div>
      </div>
    </section>

    <section class="space-y-5">
      <div class="flex items-end justify-between gap-4">
        <h2 class="font-display text-2xl font-semibold text-ink md:text-3xl">Productos destacados</h2>
        <router-link to="/tienda" class="text-sm font-semibold text-rose transition hover:text-ink">
          Ir a catalogo
        </router-link>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="producto in productosDestacados"
          :key="producto.id"
          class="rounded-2xl border border-clay bg-soft p-3 shadow-soft transition duration-200 hover:-translate-y-1"
        >
          <img
            :src="producto.imagen"
            :alt="producto.nombre"
            width="320"
            height="320"
            loading="lazy"
            class="h-52 w-full rounded-xl object-cover"
          />
          <div class="space-y-2 p-1 pt-3">
            <h3 class="text-base font-semibold text-ink">{{ producto.nombre }}</h3>
            <p class="text-sm text-ink/65">{{ producto.descripcion }}</p>
            <p class="font-display text-lg font-semibold text-rose">{{ formatPrice(producto.precio) }}</p>
            <p class="text-xs font-semibold uppercase tracking-wide text-ink/50">
              Stock: {{ producto.stock }}
            </p>
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
      catalog: useCatalog(),
    };
  },
  created() {
    this.catalog.fetchProducts();
  },
  computed: {
    productosDestacados() {
      return this.catalog.state.products.slice(0, 4);
    },
  },
  methods: {
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
