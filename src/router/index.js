import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TiendaView from "../views/TiendaView.vue";
import PagoView from "../views/PagoView.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/tienda", name: "Tienda", component: TiendaView },
  { path: "/pago", name: "Pago", component: PagoView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
