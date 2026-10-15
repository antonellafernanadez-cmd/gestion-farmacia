import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const NotificacionContext = createContext(null);

// Provee mensajes emergentes (Snackbar) para toda la aplicación.
// Uso en cualquier componente:
//   const notificar = useNotificacion();
//   notificar.exito("Medicamento creado correctamente");
//   notificar.error("Error al cargar los medicamentos");
export function NotificacionProvider({ children }) {
  const [estado, setEstado] = useState({
    abierta: false,
    mensaje: "",
    severidad: "success",
  });

  const mostrar = useCallback((mensaje, severidad) => {
    setEstado({ abierta: true, mensaje, severidad });
  }, []);

  const cerrar = (_evento, motivo) => {
    if (motivo === "clickaway") return;
    setEstado((previo) => ({ ...previo, abierta: false }));
  };

  const valor = useMemo(
    () => ({
      exito: (mensaje) => mostrar(mensaje, "success"),
      error: (mensaje) => mostrar(mensaje, "error"),
      aviso: (mensaje) => mostrar(mensaje, "warning"),
    }),
    [mostrar]
  );

  return (
    <NotificacionContext.Provider value={valor}>
      {children}
      <Snackbar
        open={estado.abierta}
        autoHideDuration={4500}
        onClose={cerrar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={cerrar} severity={estado.severidad} variant="filled" sx={{ width: "100%" }}>
          {estado.mensaje}
        </Alert>
      </Snackbar>
    </NotificacionContext.Provider>
  );
}

export function useNotificacion() {
  const contexto = useContext(NotificacionContext);
  if (!contexto) {
    throw new Error("useNotificacion debe usarse dentro de <NotificacionProvider>");
  }
  return contexto;
}
