<template>
  <header class="site-shell">
    <nav
      class="mt-5 rounded-2xl border border-clay/70 bg-soft/80 px-4 py-3 shadow-soft backdrop-blur md:px-6"
    >
      <div class="flex items-center justify-between gap-4">
        <router-link
          to="/"
          class="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl"
        >
          Bloomskin
        </router-link>

        <button
          type="button"
          class="rounded-lg border border-clay px-3 py-2 text-sm font-semibold text-ink md:hidden"
          @click="menuOpen = !menuOpen"
          aria-label="Abrir menu"
        >
          Menu
        </button>

        <ul class="hidden items-center gap-2 md:flex">
          <li v-for="link in navLinks" :key="link.to">
            <router-link
              :to="link.to"
              class="rounded-lg px-3 py-2 text-sm font-semibold transition duration-200 hover:bg-clay/70"
              active-class="bg-ink text-soft"
            >
              {{ link.label }}
            </router-link>
          </li>
          <li v-if="auth.state.user" class="px-2 text-xs font-semibold uppercase tracking-wide text-ink/60">
            {{ auth.state.user.role }}
          </li>
          <li>
            <button
              v-if="auth.state.user"
              type="button"
              class="rounded-lg border border-ink/25 px-3 py-2 text-sm font-semibold text-ink"
              @click="logout"
            >
              Salir
            </button>
          </li>
        </ul>
      </div>

      <ul v-if="menuOpen" class="mt-3 space-y-2 border-t border-clay/80 pt-3 md:hidden">
        <li v-for="link in navLinks" :key="`mobile-${link.to}`">
          <router-link
            :to="link.to"
            class="block rounded-lg px-3 py-2 text-sm font-semibold transition duration-200 hover:bg-clay/70"
            active-class="bg-ink text-soft"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </router-link>
        </li>
        <li v-if="auth.state.user">
          <button
            type="button"
            class="w-full rounded-lg border border-ink/25 px-3 py-2 text-left text-sm font-semibold text-ink"
            @click="logout"
          >
            Salir
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { useAuth } from "../composables/useAuth";

export default {
  data() {
    return {
      menuOpen: false,
      auth: useAuth(),
      baseLinks: [
        { label: "Inicio", to: "/" },
        { label: "Tienda", to: "/tienda" },
        { label: "Pago", to: "/pago" },
      ],
    };
  },
  computed: {
    navLinks() {
      const links = [...this.baseLinks];
      if (this.auth.state.user?.role === "admin") {
        links.push({ label: "Admin", to: "/admin" });
      } else {
        links.push({ label: "Login", to: "/login" });
      }
      return links;
    },
  },
  methods: {
    logout() {
      this.auth.logout();
      this.menuOpen = false;
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
  },
};
</script>
