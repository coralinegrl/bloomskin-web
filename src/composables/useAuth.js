import { reactive } from "vue";
import axios from "axios";

const STORAGE_KEY = "bloomskin.auth.v1";
const apiBaseUrl = process.env.VUE_APP_API_URL || "http://localhost:5000";

const state = reactive({
  token: "",
  user: null,
  loading: false,
});

function loadPersisted() {
  if (typeof window === "undefined") {
    return;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    state.token = parsed.token || "";
    state.user = parsed.user || null;
  } catch (error) {
    clearPersisted();
  }
}

function persist() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      token: state.token,
      user: state.user,
    })
  );
}

function clearPersisted() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}

async function login(email, password) {
  state.loading = true;
  try {
    const { data } = await axios.post(`${apiBaseUrl}/api/auth/login`, { email, password });
    state.token = data.accessToken;
    state.user = data.user;
    persist();
    return data.user;
  } finally {
    state.loading = false;
  }
}

async function register(name, email, password) {
  state.loading = true;
  try {
    const { data } = await axios.post(`${apiBaseUrl}/api/auth/register`, { name, email, password });
    state.token = data.accessToken;
    state.user = data.user;
    persist();
    return data.user;
  } finally {
    state.loading = false;
  }
}

function logout() {
  state.token = "";
  state.user = null;
  clearPersisted();
}

function getAuthHeaders() {
  return state.token ? { Authorization: `Bearer ${state.token}` } : {};
}

async function hydrateUser() {
  if (!state.token) {
    return null;
  }

  state.loading = true;
  try {
    const { data } = await axios.get(`${apiBaseUrl}/api/auth/me`, {
      headers: getAuthHeaders(),
    });
    state.user = data.user;
    persist();
    return data.user;
  } catch (error) {
    logout();
    return null;
  } finally {
    state.loading = false;
  }
}

loadPersisted();

const authStore = {
  state,
  login,
  register,
  logout,
  hydrateUser,
  getAuthHeaders,
  apiBaseUrl,
};

export function useAuth() {
  return authStore;
}
