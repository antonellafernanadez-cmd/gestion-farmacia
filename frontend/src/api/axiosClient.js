import axios from "axios";

// Único lugar donde se configura la conexión con el backend Flask.
// La dirección se toma de .env (VITE_API_URL); si no existe, usa localhost:5000.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
    // Envía y recibe la cookie de sesión del login (el backend usa sesiones de Flask).
  withCredentials: true,
});

export default apiClient;
