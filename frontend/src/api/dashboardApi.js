import apiClient from "./axiosClient";

// Pendiente en el backend: GET /api/dashboard debe devolver algo como
// { "medicamentos": 10, "categorias": 5, "empleados": 5 }
export const obtenerResumen = () =>
  apiClient.get("/dashboard").then((respuesta) => respuesta.data);
