import { Box, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import EncabezadoPagina from "./EncabezadoPagina";

// Pantalla provisoria para las secciones que todavía no se desarrollaron.
// Se reemplaza por la pantalla real cuando se implemente.
export default function PaginaPendiente({ titulo, descripcion, tareas = [] }) {
  return (
    <>
      <EncabezadoPagina titulo={titulo} descripcion={descripcion} />
      <Paper
        variant="outlined"
        sx={{ p: 3, borderStyle: "dashed", borderColor: "primary.light" }}
      >
        <Typography variant="h6" gutterBottom>
          Pendiente de desarrollar
        </Typography>
        <Typography color="text.secondary">
          Tomá como modelo la pantalla de Categorías (src/pages/Categorias). Falta:
        </Typography>
        <Box component={List} dense sx={{ listStyle: "disc", pl: 3, mt: 1 }}>
          {tareas.map((tarea) => (
            <ListItem key={tarea} sx={{ display: "list-item", py: 0.25 }}>
              <ListItemText primary={tarea} />
            </ListItem>
          ))}
        </Box>
      </Paper>
    </>
  );
}
