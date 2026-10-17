import apiClient from "./axiosClient";

// Llamadas de autenticación contra el backend Flask (/api/auth/...).
// La sesión viaja en una cookie: por eso axiosClient usa withCredentials.
export const iniciarSesion = (email, password) =>
  apiClient.post("/auth/login", { email, password }).then((respuesta) => respuesta.data);

export const cerrarSesion = () =>
  apiClient.post("/auth/logout").then((respuesta) => respuesta.data);

// Devuelve { id, email, rol } si hay sesión activa; si no, el backend responde 401.
export const obtenerSesion = () =>
  apiClient.get("/auth/me").then((respuesta) => respuesta.data);