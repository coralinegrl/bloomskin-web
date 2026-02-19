import { reactive } from "vue";
import axios from "axios";
import { defaultProducts } from "../data/defaultProducts";
import { useAuth } from "./useAuth";

const STORAGE_KEY = "bloomskin.catalog.v1";
const apiBaseUrl = process.env.VUE_APP_API_URL || "http://localhost:5000";

const state = reactive({
  products: loadProducts(),
  loading: false,
});

function loadProducts() {
  if (typeof window === "undefined") {
    return [...defaultProducts];
  }

  const persisted = window.localStorage.getItem(STORAGE_KEY);
  if (!persisted) {
    return [...defaultProducts];
  }

  try {
    const parsed = JSON.parse(persisted);
    if (!Array.isArray(parsed) || !parsed.length) {
      return [...defaultProducts];
    }
    return parsed.map(normalizeProduct);
  } catch (error) {
    return [...defaultProducts];
  }
}

function normalizeProduct(product, index = 0) {
  return {
    id: product.id || `sku-${Date.now()}-${index}`,
    nombre: String(product.nombre || "Producto sin nombre"),
    precio: toPositiveNumber(product.precio),
    descripcion: String(product.descripcion || "Sin descripcion."),
    imagen: String(product.imagen || ""),
    stock: Math.max(0, Math.floor(toPositiveNumber(product.stock))),
  };
}

function toPositiveNumber(value) {
  const number = Number(value);
  if (Number.isFinite(number) && number >= 0) {
    return number;
  }
  return 0;
}

function persistProducts() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.products));
}

function replaceProducts(products) {
  state.products = products.map(normalizeProduct);
  persistProducts();
}

async function fetchProducts() {
  state.loading = true;
  try {
    const response = await axios.get(`${apiBaseUrl}/api/products`, { timeout: 8000 });
    if (Array.isArray(response.data)) {
      replaceProducts(response.data);
    }
    return state.products;
  } catch (error) {
    return state.products;
  } finally {
    state.loading = false;
  }
}

function authConfig() {
  const auth = useAuth();
  return {
    headers: auth.getAuthHeaders(),
  };
}

async function addProduct(payload) {
  const product = normalizeProduct({
    ...payload,
    id: payload.id || `sku-${Date.now()}`,
  });
  try {
    const response = await axios.post(`${apiBaseUrl}/api/products`, payload, authConfig());
    state.products = [normalizeProduct(response.data), ...state.products];
    persistProducts();
    return response.data;
  } catch (error) {
    state.products = [product, ...state.products];
    persistProducts();
    return product;
  }
}

async function updateProduct(id, updates) {
  try {
    const current = state.products.find((item) => item.id === id);
    const payload = {
      ...current,
      ...updates,
    };
    const response = await axios.put(`${apiBaseUrl}/api/products/${id}`, payload, authConfig());
    state.products = state.products.map((item) =>
      item.id === id ? normalizeProduct(response.data) : item
    );
    persistProducts();
    return response.data;
  } catch (error) {
    state.products = state.products.map((product) => {
      if (product.id !== id) {
        return product;
      }
      return normalizeProduct({ ...product, ...updates });
    });
    persistProducts();
    return null;
  }
}

async function removeProduct(id) {
  try {
    await axios.delete(`${apiBaseUrl}/api/products/${id}`, authConfig());
  } catch (error) {
    // Keep local fallback behavior when API is unavailable.
  }
  state.products = state.products.filter((product) => product.id !== id);
  persistProducts();
}

async function adjustStock(id, delta) {
  try {
    const response = await axios.patch(
      `${apiBaseUrl}/api/products/${id}/stock`,
      { delta: Math.trunc(delta) },
      authConfig()
    );
    state.products = state.products.map((item) =>
      item.id === id ? normalizeProduct(response.data) : item
    );
    persistProducts();
    return response.data;
  } catch (error) {
    state.products = state.products.map((product) => {
      if (product.id !== id) {
        return product;
      }
      return {
        ...product,
        stock: Math.max(0, product.stock + Math.trunc(delta)),
      };
    });
    persistProducts();
    return null;
  }
}

function resetCatalog() {
  replaceProducts(defaultProducts);
}

const store = {
  state,
  addProduct,
  updateProduct,
  removeProduct,
  adjustStock,
  replaceProducts,
  resetCatalog,
  fetchProducts,
};

export function useCatalog() {
  return store;
}
