import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// Ventana de confirmación reutilizable (por ejemplo, antes de eliminar un registro).
export default function DialogoConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Eliminar",
  cargando = false,
  onConfirmar,
  onCancelar,
}) {
  return (
    <Dialog open={abierto} onClose={cargando ? undefined : onCancelar} maxWidth="xs">
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{mensaje}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancelar} disabled={cargando} color="inherit">
          Cancelar
        </Button>
        <Button onClick={onConfirmar} disabled={cargando} color="error" variant="contained">
          {cargando ? "Eliminando…" : textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
