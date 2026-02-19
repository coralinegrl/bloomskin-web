import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
    meta: {
      title: "Bloomskin | Inicio",
      description: "Descubre productos de skincare pensados para una piel sana y luminosa.",
    },
  },
  {
    path: "/tienda",
    name: "Tienda",
    component: () => import("../views/TiendaView.vue"),
    meta: {
      title: "Bloomskin | Tienda",
      description: "Explora el catalogo Bloomskin con formulas de cuidado facial para cada rutina.",
    },
  },
  {
    path: "/pago",
    name: "Pago",
    component: () => import("../views/PagoView.vue"),
    meta: {
      title: "Bloomskin | Pago",
      description: "Revisa datos de transferencia y sube tu comprobante de pago en Bloomskin.",
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../views/AdminView.vue"),
    meta: {
      title: "Bloomskin | Administrador",
      description: "Panel de administracion para actualizar stock y gestionar productos.",
      requiresAuth: true,
      roles: ["admin"],
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
    meta: {
      title: "Bloomskin | Login",
      description: "Inicia sesion o crea tu cuenta Bloomskin.",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

router.beforeEach(async (to) => {
  const auth = useAuth();

  if (auth.state.token && !auth.state.user) {
    await auth.hydrateUser();
  }

  if (to.meta?.requiresAuth && !auth.state.token) {
    return { path: "/login" };
  }

  if (to.meta?.roles?.length) {
    const role = auth.state.user?.role;
    if (!role || !to.meta.roles.includes(role)) {
      return { path: "/tienda" };
    }
  }

  if (to.path === "/login" && auth.state.token) {
    return { path: "/tienda" };
  }

  return true;
});

router.afterEach((to) => {
  const defaultTitle = "Bloomskin | Skincare Studio";
  const defaultDescription =
    "Bloomskin: skincare moderno con formulas efectivas para una piel sana y luminosa.";

  document.title = to.meta?.title || defaultTitle;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute("content", to.meta?.description || defaultDescription);
  }
});

export default router;
