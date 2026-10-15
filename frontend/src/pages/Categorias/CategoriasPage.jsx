import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import categoriasApi from "../../api/categoriasApi";
import EncabezadoPagina from "../../components/common/EncabezadoPagina";
import DialogoConfirmacion from "../../components/common/DialogoConfirmacion";
import { useNotificacion } from "../../context/NotificacionContext";
import { obtenerMensajeError } from "../../utils/errores";
import CategoriaForm from "./CategoriaForm";

// PANTALLA MODELO: las de Medicamentos y Empleados siguen este mismo patrón.
//   1. Cargar la lista desde la API al abrir la pantalla.
//   2. Mostrarla en una tabla (con estados: cargando, error y vacío).
//   3. Formulario en Dialog para crear/editar.
//   4. Confirmación antes de eliminar.
//   5. Snackbar con el resultado de cada operación.
export default function CategoriasPage() {
  const notificar = useNotificacion();

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [formAbierto, setFormAbierto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarCategorias = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");
    try {
      setCategorias(await categoriasApi.listar());
    } catch (error) {
      setErrorCarga(obtenerMensajeError(error, "Error al cargar las categorías"));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const abrirFormNuevo = () => {
    setCategoriaEditando(null);
    setFormAbierto(true);
  };

  const abrirFormEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setFormAbierto(true);
  };

  const alGuardar = (mensaje) => {
    setFormAbierto(false);
    notificar.exito(mensaje);
    cargarCategorias();
  };

  const confirmarEliminar = async () => {
    setEliminando(true);
    try {
      const respuesta = await categoriasApi.eliminar(categoriaAEliminar.id);
      notificar.exito(respuesta.mensaje);
      setCategoriaAEliminar(null);
      cargarCategorias();
    } catch (error) {
      // Por ejemplo: 409 "No se puede eliminar: la categoría tiene medicamentos"
      notificar.error(obtenerMensajeError(error, "No se pudo eliminar la categoría"));
      setCategoriaAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      <EncabezadoPagina
        titulo="Categorías"
        descripcion="Agrupá los medicamentos por tipo."
        accion={
          <Button variant="contained" startIcon={<AddIcon />} onClick={abrirFormNuevo}>
            Nueva categoría
          </Button>
        }
      />

      {errorCarga && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={cargarCategorias}>
              Reintentar
            </Button>
          }
        >
          {errorCarga}
        </Alert>
      )}

      <Paper variant="outlined">
        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress aria-label="Cargando categorías" />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categorias.length === 0 && !errorCarga && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        Todavía no hay categorías. Creá la primera con el botón «Nueva categoría».
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {categorias.map((categoria) => (
                  <TableRow key={categoria.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{categoria.nombre}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {categoria.descripcion || "—"}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label={`Editar ${categoria.nombre}`}
                          onClick={() => abrirFormEditar(categoria)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          aria-label={`Eliminar ${categoria.nombre}`}
                          color="error"
                          onClick={() => setCategoriaAEliminar(categoria)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <CategoriaForm
        abierto={formAbierto}
        categoria={categoriaEditando}
        onCerrar={() => setFormAbierto(false)}
        onGuardado={alGuardar}
      />

      <DialogoConfirmacion
        abierto={Boolean(categoriaAEliminar)}
        titulo="Eliminar categoría"
        mensaje={`¿Seguro que querés eliminar «${categoriaAEliminar?.nombre ?? ""}»? Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setCategoriaAEliminar(null)}
      />
    </>
  );
}
