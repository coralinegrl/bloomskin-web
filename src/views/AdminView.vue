<template>
  <div class="site-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
    <section class="rounded-3xl border border-clay bg-soft p-6 shadow-soft md:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-rose">Vista Administrador</p>
      <h1 class="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
        Gestion de catalogo
      </h1>
      <p class="mt-3 text-sm text-ink/70 md:text-base">
        Agrega productos nuevos o actualiza precio, imagen y stock en tiempo real.
      </p>

      <form class="mt-6 space-y-3" @submit.prevent="handleSubmit">
        <input
          v-model.trim="form.nombre"
          type="text"
          required
          class="w-full rounded-xl border border-clay bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-rose"
          placeholder="Nombre del producto"
        />
        <textarea
          v-model.trim="form.descripcion"
          rows="3"
          required
          class="w-full rounded-xl border border-clay bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-rose"
          placeholder="Descripcion breve"
        ></textarea>
        <input
          v-model.number="form.precio"
          type="number"
          min="0"
          required
          class="w-full rounded-xl border border-clay bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-rose"
          placeholder="Precio"
        />
        <input
          v-model.number="form.stock"
          type="number"
          min="0"
          required
          class="w-full rounded-xl border border-clay bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-rose"
          placeholder="Stock"
        />
        <input
          v-model.trim="form.imagen"
          type="url"
          required
          class="w-full rounded-xl border border-clay bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-rose"
          placeholder="URL imagen"
        />

        <div class="flex flex-wrap gap-2 pt-1">
          <button type="submit" class="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-soft hover:bg-rose">
            {{ editingId ? "Guardar cambios" : "Agregar producto" }}
          </button>
          <button
            v-if="editingId"
            type="button"
            class="rounded-xl border border-ink/25 px-4 py-2 text-sm font-semibold text-ink"
            @click="cancelEdit"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="rounded-xl border border-rose/30 px-4 py-2 text-sm font-semibold text-rose"
            @click="resetCatalog"
          >
            Restaurar catalogo base
          </button>
        </div>
      </form>
    </section>

    <section class="space-y-3">
      <article
        v-for="producto in productos"
        :key="producto.id"
        class="rounded-2xl border border-clay bg-soft p-4 shadow-soft"
      >
        <div class="flex gap-3">
          <img
            :src="producto.imagen"
            :alt="producto.nombre"
            width="120"
            height="120"
            class="h-20 w-20 rounded-xl object-cover"
            loading="lazy"
          />
          <div class="min-w-0 flex-1">
            <h2 class="truncate text-base font-semibold text-ink">{{ producto.nombre }}</h2>
            <p class="text-sm text-ink/65">{{ formatPrice(producto.precio) }}</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/50">
              Stock: {{ producto.stock }}
            </p>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-soft"
            @click="startEdit(producto)"
          >
            Editar
          </button>
          <button
            type="button"
            class="rounded-lg border border-ink/20 px-3 py-1.5 text-xs font-semibold text-ink"
            @click="adjustStock(producto.id, 1)"
          >
            +1 stock
          </button>
          <button
            type="button"
            class="rounded-lg border border-ink/20 px-3 py-1.5 text-xs font-semibold text-ink"
            @click="adjustStock(producto.id, -1)"
          >
            -1 stock
          </button>
          <button
            type="button"
            class="rounded-lg border border-rose/30 px-3 py-1.5 text-xs font-semibold text-rose"
            @click="deleteProduct(producto.id)"
          >
            Eliminar
          </button>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import { useCatalog } from "../composables/useCatalog";

const emptyForm = () => ({
  nombre: "",
  descripcion: "",
  precio: 0,
  stock: 0,
  imagen: "",
});

export default {
  data() {
    return {
      catalog: useCatalog(),
      editingId: null,
      form: emptyForm(),
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
    async handleSubmit() {
      const payload = {
        nombre: this.form.nombre,
        descripcion: this.form.descripcion,
        precio: this.form.precio,
        stock: this.form.stock,
        imagen: this.form.imagen,
      };

      if (this.editingId) {
        await this.catalog.updateProduct(this.editingId, payload);
      } else {
        await this.catalog.addProduct(payload);
      }

      this.cancelEdit();
    },
    startEdit(producto) {
      this.editingId = producto.id;
      this.form = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        imagen: producto.imagen,
      };
    },
    cancelEdit() {
      this.editingId = null;
      this.form = emptyForm();
    },
    async adjustStock(id, delta) {
      await this.catalog.adjustStock(id, delta);
    },
    async deleteProduct(id) {
      await this.catalog.removeProduct(id);
      if (this.editingId === id) {
        this.cancelEdit();
      }
    },
    resetCatalog() {
      this.catalog.resetCatalog();
      this.cancelEdit();
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
