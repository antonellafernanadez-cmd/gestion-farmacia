import { Box, Typography } from "@mui/material";

// Título de cada pantalla, con un espacio a la derecha para el botón principal.
export default function EncabezadoPagina({ titulo, descripcion, accion }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1">
          {titulo}
        </Typography>
        {descripcion && (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {descripcion}
          </Typography>
        )}
      </Box>
      {accion}
    </Box>
  );
}
