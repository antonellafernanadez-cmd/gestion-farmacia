import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import categoriasApi from "../../api/categoriasApi";
import { obtenerMensajeError } from "../../utils/errores";

// Formulario en ventana emergente para crear o editar una categoría.
// - categoria = null  -> modo "crear"
// - categoria = {...} -> modo "editar"
export default function CategoriaForm({ abierto, categoria, onCerrar, onGuardado }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorServidor, setErrorServidor] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Cada vez que se abre el formulario, se cargan los datos de la categoría (o se vacían).
  useEffect(() => {
    if (abierto) {
      setNombre(categoria?.nombre ?? "");
      setDescripcion(categoria?.descripcion ?? "");
      setErrorNombre("");
      setErrorServidor("");
    }
  }, [abierto, categoria]);

  const guardar = async (evento) => {
    evento.preventDefault();

    // Validación en el frontend (el backend valida de nuevo por seguridad)
    if (!nombre.trim()) {
      setErrorNombre("El nombre es obligatorio");
      return;
    }

    setGuardando(true);
    setErrorServidor("");
    const cuerpo = { nombre: nombre.trim(), descripcion: descripcion.trim() };

    try {
      const respuesta = categoria
        ? await categoriasApi.modificar(categoria.id, cuerpo)
        : await categoriasApi.crear(cuerpo);
      onGuardado(respuesta.mensaje);
    } catch (error) {
      // Por ejemplo: 409 "Ya existe una categoría con ese nombre"
      setErrorServidor(obtenerMensajeError(error, "No se pudo guardar la categoría"));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={abierto} onClose={guardando ? undefined : onCerrar}>
      <form onSubmit={guardar} noValidate>
        <DialogTitle>{categoria ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {errorServidor && <Alert severity="error">{errorServidor}</Alert>}
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrorNombre("");
              }}
              error={Boolean(errorNombre)}
              helperText={errorNombre}
              required
              autoFocus
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
            <TextField
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              multiline
              minRows={2}
              slotProps={{ htmlInput: { maxLength: 255 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCerrar} disabled={guardando} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={guardando}>
            {guardando ? "Guardando…" : categoria ? "Guardar cambios" : "Crear categoría"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
