import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/axiosClient";
import {
  cerrarSesion as cerrarSesionApi,
  iniciarSesion as iniciarSesionApi,
  obtenerSesion,
} from "../api/authApi";

const AuthContext = createContext(null);

// Guarda quién tiene la sesión iniciada: { id, email, rol } o null.
// Uso en cualquier componente:
//   const { usuario, esAdmin, iniciarSesion, cerrarSesion } = useAuth();
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true); // mientras se consulta si ya hay sesión

  // Al abrir o recargar la app: ¿el servidor tiene una sesión activa para esta cookie?
  useEffect(() => {
    obtenerSesion()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  // Si el servidor responde 401 en cualquier pantalla (sesión vencida), se cierra la sesión acá
  // y las rutas protegidas mandan solas al login.
  useEffect(() => {
    const id = apiClient.interceptors.response.use(
      (respuesta) => respuesta,
      (error) => {
        const url = error.config?.url ?? "";
        if (error.response?.status === 401 && !url.startsWith("/auth/")) setUsuario(null);
        return Promise.reject(error);
      }
    );
    return () => apiClient.interceptors.response.eject(id);
  }, []);

  const iniciarSesion = useCallback(async (email, password) => {
    const respuesta = await iniciarSesionApi(email, password);
    setUsuario(respuesta.usuario);
    return respuesta.usuario;
  }, []);

  const cerrarSesion = useCallback(async () => {
    try {
      await cerrarSesionApi();
    } finally {
      setUsuario(null);
    }
  }, []);

  const valor = useMemo(
    () => ({ usuario, cargando, esAdmin: usuario?.rol === "admin", iniciarSesion, cerrarSesion }),
    [usuario, cargando, iniciarSesion, cerrarSesion]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return contexto;
}