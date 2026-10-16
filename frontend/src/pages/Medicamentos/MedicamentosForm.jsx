import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import categoriasApi from "../../api/categoriasApi";
import medicamentosApi from "../../api/medicamentosApi";
import { obtenerMensajeError } from "../../utils/errores";

const VACIO = {
  nombre: "",
  laboratorio: "",
  precio: "",
  stock: "",
  fecha_vencimiento: "",
  categoria_id: "",
};

// Formulario en ventana emergente para crear o editar un medicamento.
// - medicamento = null  -> modo "crear"
// - medicamento = {...} -> modo "editar"
export default function MedicamentoForm({ abierto, medicamento, onCerrar, onGuardado }) {
  const [valores, setValores] = useState(VACIO);
  const [categorias, setCategorias] = useState([]);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Cada vez que se abre: se cargan los datos del medicamento (o se vacían)
  // y se pide la lista de categorías para el selector.
  useEffect(() => {
    if (!abierto) return;

    setValores(
      medicamento
        ? {
            nombre: medicamento.nombre ?? "",
            laboratorio: medicamento.laboratorio ?? "",
            precio: medicamento.precio ?? "",
            stock: medicamento.stock ?? "",
            fecha_vencimiento: medicamento.fecha_vencimiento ?? "",
            categoria_id: medicamento.categoria_id ?? "",
          }
        : VACIO
    );
    setErrores({});
    setErrorServidor("");

    categoriasApi
      .listar()
      .then(setCategorias)
      .catch((error) =>
        setErrorServidor(obtenerMensajeError(error, "No se pudieron cargar las categorías"))
      );
  }, [abierto, medicamento]);

  const cambiar = (campo) => (evento) => {
    setValores((anteriores) => ({ ...anteriores, [campo]: evento.target.value }));
    setErrores((anteriores) => ({ ...anteriores, [campo]: "" }));
  };

  // Validación en el frontend (el backend valida de nuevo por seguridad)
  const validar = () => {
    const nuevos = {};
    if (!valores.nombre.trim()) nuevos.nombre = "El nombre es obligatorio";
    if (!(Number(valores.precio) > 0)) nuevos.precio = "El precio debe ser mayor a 0";
    if (
      valores.stock === "" ||
      !Number.isInteger(Number(valores.stock)) ||
      Number(valores.stock) < 0
    ) {
      nuevos.stock = "El stock debe ser un número entero, sin negativos";
    }
    if (!valores.categoria_id) nuevos.categoria_id = "Elegí una categoría";
    return nuevos;
  };

  const guardar = async (evento) => {
    evento.preventDefault();

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setGuardando(true);
    setErrorServidor("");
    const cuerpo = {
      nombre: valores.nombre.trim(),
      laboratorio: valores.laboratorio.trim(),
      precio: Number(valores.precio),
      stock: Number(valores.stock),
      fecha_vencimiento: valores.fecha_vencimiento || null,
      categoria_id: Number(valores.categoria_id),
    };

    try {
      const respuesta = medicamento
        ? await medicamentosApi.modificar(medicamento.id, cuerpo)
        : await medicamentosApi.crear(cuerpo);
      onGuardado(respuesta.mensaje);
    } catch (error) {
      // Por ejemplo: 400 "El precio debe ser mayor a 0"
      setErrorServidor(obtenerMensajeError(error, "No se pudo guardar el medicamento"));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={abierto} onClose={guardando ? undefined : onCerrar} fullWidth maxWidth="sm">
      <form onSubmit={guardar} noValidate>
        <DialogTitle>{medicamento ? "Editar medicamento" : "Nuevo medicamento"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {errorServidor && <Alert severity="error">{errorServidor}</Alert>}
            <TextField
              label="Nombre"
              value={valores.nombre}
              onChange={cambiar("nombre")}
              error={Boolean(errores.nombre)}
              helperText={errores.nombre}
              required
              autoFocus
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
            <TextField
              label="Laboratorio"
              value={valores.laboratorio}
              onChange={cambiar("laboratorio")}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
            <TextField
              label="Precio"
              type="number"
              value={valores.precio}
              onChange={cambiar("precio")}
              error={Boolean(errores.precio)}
              helperText={errores.precio}
              required
              slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
            />
            <TextField
              label="Stock"
              type="number"
              value={valores.stock}
              onChange={cambiar("stock")}
              error={Boolean(errores.stock)}
              helperText={errores.stock}
              required
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />
            <TextField
              label="Fecha de vencimiento"
              type="date"
              value={valores.fecha_vencimiento}
              onChange={cambiar("fecha_vencimiento")}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              select
              label="Categoría"
              value={valores.categoria_id}
              onChange={cambiar("categoria_id")}
              error={Boolean(errores.categoria_id)}
              helperText={
                errores.categoria_id ||
                (categorias.length === 0 ? "Primero tenés que crear una categoría" : "")
              }
              required
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCerrar} disabled={guardando} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={guardando}>
            {guardando ? "Guardando…" : medicamento ? "Guardar cambios" : "Crear medicamento"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}