<template>
  <div class="site-shell grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
    <section class="rounded-3xl border border-clay bg-soft p-6 shadow-soft md:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-rose">Pago Manual</p>
      <h1 class="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">Pago por transferencia</h1>
      <p class="mt-3 text-sm text-ink/70 md:text-base">
        Completa la transferencia y sube tu comprobante para validacion.
      </p>

      <dl class="mt-6 grid gap-3 rounded-2xl border border-clay/80 bg-clay/30 p-4 text-sm md:text-base">
        <div class="flex items-center justify-between gap-4">
          <dt class="font-semibold text-ink/80">Banco</dt>
          <dd class="font-semibold text-ink">Banco X</dd>
        </div>
        <div class="flex items-center justify-between gap-4">
          <dt class="font-semibold text-ink/80">Cuenta</dt>
          <dd class="font-semibold text-ink">123456789</dd>
        </div>
        <div class="flex items-center justify-between gap-4">
          <dt class="font-semibold text-ink/80">Titular</dt>
          <dd class="font-semibold text-ink">Bloomskin SpA</dd>
        </div>
        <div class="flex items-center justify-between gap-4">
          <dt class="font-semibold text-ink/80">Correo</dt>
          <dd class="font-semibold text-ink">contacto@bloomskin.cl</dd>
        </div>
      </dl>
    </section>

    <section class="rounded-3xl border border-clay bg-soft p-6 shadow-soft md:p-8">
      <h2 class="font-display text-2xl font-semibold text-ink">Subir comprobante</h2>
      <p class="mt-2 text-sm text-ink/70">Formato permitido: PDF, JPG o PNG. Maximo 10 MB.</p>

      <label
        class="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-clay bg-clay/30 px-4 py-8 text-center"
      >
        <span class="text-sm font-semibold text-ink">Seleccionar archivo</span>
        <span class="text-xs text-ink/60">Click para buscar en tu dispositivo</span>
        <input type="file" class="hidden" accept=".pdf,.png,.jpg,.jpeg" @change="subirComprobante" />
      </label>

      <p v-if="selectedFile" class="mt-4 rounded-xl border border-clay px-3 py-2 text-sm text-ink/80">
        Archivo: {{ selectedFile.name }} ({{ formatSize(selectedFile.size) }})
      </p>

      <p
        v-if="statusMessage"
        class="mt-4 rounded-xl border px-3 py-2 text-sm"
        :class="isError ? 'border-rose/50 bg-rose/10 text-rose' : 'border-green-500/40 bg-green-500/10 text-green-700'"
      >
        {{ statusMessage }}
      </p>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFile: null,
      statusMessage: "",
      isError: false,
    };
  },
  methods: {
    subirComprobante(event) {
      const file = event.target.files?.[0];
      this.statusMessage = "";
      this.isError = false;

      if (!file) {
        return;
      }

      const maxBytes = 10 * 1024 * 1024;
      if (file.size > maxBytes) {
        this.selectedFile = null;
        this.statusMessage = "El archivo supera 10 MB. Selecciona uno mas liviano.";
        this.isError = true;
        return;
      }

      this.selectedFile = file;
      console.log("Archivo seleccionado:", file);
      this.statusMessage = "Comprobante cargado correctamente. Pronto validaremos tu pago.";
    },
    formatSize(bytes) {
      if (bytes < 1024 * 1024) {
        return `${Math.round(bytes / 1024)} KB`;
      }
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    },
  },
};
</script>
