<template>
  <div class="site-shell grid gap-6 lg:grid-cols-2">
    <section class="rounded-3xl border border-clay bg-soft p-6 shadow-soft md:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-rose">Acceso</p>
      <h1 class="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">Iniciar sesion</h1>
      <p class="mt-3 text-sm text-ink/70 md:text-base">
        Inicia sesion para acceder como cliente o administrador.
      </p>

      <form class="mt-6 space-y-3" @submit.prevent="submitLogin">
        <input
          v-model.trim="loginForm.email"
          type="email"
          required
          class="w-full rounded-xl border border-clay bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-rose"
          placeholder="Correo"
        />
        <input
          v-model="loginForm.password"
          type="password"
          required
          class="w-full rounded-xl border border-clay bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-rose"
          placeholder="Contrasena"
        />
        <button type="submit" class="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-soft hover:bg-rose">
          Entrar
        </button>
      </form>
    </section>

    <section class="rounded-3xl border border-clay bg-soft p-6 shadow-soft md:p-8">
      <h2 class="font-display text-2xl font-semibold text-ink">Crear cuenta</h2>
      <p class="mt-2 text-sm text-ink/70">
        Las cuentas nuevas se crean como cliente. El rol admin se asigna desde base de datos.
      </p>

      <form class="mt-6 space-y-3" @submit.prevent="submitRegister">
        <input
          v-model.trim="registerForm.name"
          type="text"
          required
          class="w-full rounded-xl border border-clay bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-rose"
          placeholder="Nombre"
        />
        <input
          v-model.trim="registerForm.email"
          type="email"
          required
          class="w-full rounded-xl border border-clay bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-rose"
          placeholder="Correo"
        />
        <input
          v-model="registerForm.password"
          type="password"
          minlength="8"
          required
          class="w-full rounded-xl border border-clay bg-white/80 px-3 py-2 text-sm text-ink outline-none focus:border-rose"
          placeholder="Contrasena (min 8)"
        />
        <button type="submit" class="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-soft hover:bg-rose">
          Registrarme
        </button>
      </form>

      <p
        v-if="message"
        class="mt-4 rounded-xl border px-3 py-2 text-sm"
        :class="error ? 'border-rose/50 bg-rose/10 text-rose' : 'border-green-500/40 bg-green-500/10 text-green-700'"
      >
        {{ message }}
      </p>
    </section>
  </div>
</template>

<script>
import { useAuth } from "../composables/useAuth";

export default {
  data() {
    return {
      auth: useAuth(),
      loginForm: {
        email: "",
        password: "",
      },
      registerForm: {
        name: "",
        email: "",
        password: "",
      },
      message: "",
      error: false,
    };
  },
  methods: {
    async submitLogin() {
      this.message = "";
      this.error = false;
      try {
        const user = await this.auth.login(this.loginForm.email, this.loginForm.password);
        this.message = `Bienvenido ${user.name}.`;
        this.$router.push(user.role === "admin" ? "/admin" : "/tienda");
      } catch (err) {
        this.error = true;
        this.message = "No se pudo iniciar sesion. Verifica correo y contrasena.";
      }
    },
    async submitRegister() {
      this.message = "";
      this.error = false;
      try {
        const user = await this.auth.register(
          this.registerForm.name,
          this.registerForm.email,
          this.registerForm.password
        );
        this.message = `Cuenta creada para ${user.email}.`;
        this.$router.push("/tienda");
      } catch (err) {
        this.error = true;
        this.message = "No se pudo crear la cuenta. Revisa los datos.";
      }
    },
  },
};
</script>
