<template>
  <div class="grain-overlay">
    <Navbar />
    <main class="pb-14 pt-8 md:pt-10">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
};
</script>
