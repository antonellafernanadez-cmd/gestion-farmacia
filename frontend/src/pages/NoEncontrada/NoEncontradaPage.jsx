import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import EncabezadoPagina from "../../components/common/EncabezadoPagina";

export default function NoEncontradaPage() {
  return (
    <>
      <EncabezadoPagina titulo="Página no encontrada" />
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        La dirección que buscás no existe en la aplicación.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Volver al dashboard
      </Button>
    </>
  );
}
