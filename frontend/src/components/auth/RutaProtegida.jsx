import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Link, Navigate, useLocation } from "react-router-dom";
import EncabezadoPagina from "../common/EncabezadoPagina";
import { useAuth } from "../../context/AuthContext";

// Envuelve pantallas que requieren sesión.
//   <RutaProtegida>                      -> cualquier usuario con sesión
//   <RutaProtegida roles={["admin"]}>    -> solo ese rol; el resto ve "Acceso restringido"
// Importante: esto solo ordena la pantalla. La seguridad real está en el backend,
// que responde 401/403 aunque alguien escriba la dirección a mano.
export default function RutaProtegida({ children, roles }) {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress aria-label="Verificando sesión" />
      </Box>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion }} />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return (
      <>
        <EncabezadoPagina titulo="Acceso restringido" />
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Esta sección es solo para administración.
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Volver al inicio
        </Button>
      </>
    );
  }

  return children;
}