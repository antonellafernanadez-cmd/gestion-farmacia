import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import medicamentosApi from "../../api/medicamentosApi";
import EncabezadoPagina from "../../components/common/EncabezadoPagina";
import DialogoConfirmacion from "../../components/common/DialogoConfirmacion";
import { useNotificacion } from "../../context/NotificacionContext";
import { obtenerMensajeError } from "../../utils/errores";
import MedicamentoForm from "./MedicamentosForm";

// Mismo criterio que usa el backend en el dashboard
const STOCK_BAJO = 5;

const formatearPrecio = (valor) =>
  Number(valor).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

// Fecha "2027-08-15" -> "15/08/2027" (sin pasar por Date para evitar desfases de zona horaria)
const formatearFecha = (iso) => (iso ? iso.split("-").reverse().join("/") : "—");

// Sigue el mismo patrón que la pantalla de Categorías:
//   cargar lista -> tabla -> formulario en Dialog -> confirmar eliminar -> Snackbar
export default function MedicamentosPage() {
  const notificar = useNotificacion();

  const [medicamentos, setMedicamentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [formAbierto, setFormAbierto] = useState(false);
  const [medicamentoEditando, setMedicamentoEditando] = useState(null);

  const [medicamentoAEliminar, setMedicamentoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarMedicamentos = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");
    try {
      setMedicamentos(await medicamentosApi.listar());
    } catch (error) {
      setErrorCarga(obtenerMensajeError(error, "Error al cargar los medicamentos"));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarMedicamentos();
  }, [cargarMedicamentos]);

  // Filtro por nombre (se hace en el navegador, sobre la lista ya cargada)
  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return texto
      ? medicamentos.filter((m) => m.nombre.toLowerCase().includes(texto))
      : medicamentos;
  }, [medicamentos, busqueda]);

  const abrirFormNuevo = () => {
    setMedicamentoEditando(null);
    setFormAbierto(true);
  };

  const abrirFormEditar = (medicamento) => {
    setMedicamentoEditando(medicamento);
    setFormAbierto(true);
  };

  const alGuardar = (mensaje) => {
    setFormAbierto(false);
    notificar.exito(mensaje);
    cargarMedicamentos();
  };

  const confirmarEliminar = async () => {
    setEliminando(true);
    try {
      const respuesta = await medicamentosApi.eliminar(medicamentoAEliminar.id);
      notificar.exito(respuesta.mensaje);
      setMedicamentoAEliminar(null);
      cargarMedicamentos();
    } catch (error) {
      notificar.error(obtenerMensajeError(error, "No se pudo eliminar el medicamento"));
      setMedicamentoAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      <EncabezadoPagina
        titulo="Medicamentos"
        descripcion="Administrá el stock y los precios de los medicamentos."
        accion={
          <Button variant="contained" startIcon={<AddIcon />} onClick={abrirFormNuevo}>
            Nuevo medicamento
          </Button>
        }
      />

      {errorCarga && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={cargarMedicamentos}>
              Reintentar
            </Button>
          }
        >
          {errorCarga}
        </Alert>
      )}

      <TextField
        size="small"
        label="Buscar por nombre"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        sx={{ mb: 2, minWidth: 280 }}
      />

      <Paper variant="outlined">
        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress aria-label="Cargando medicamentos" />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Laboratorio</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Vencimiento</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibles.length === 0 && !errorCarga && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        {medicamentos.length === 0
                          ? "Todavía no hay medicamentos. Creá el primero con el botón «Nuevo medicamento»."
                          : "No hay medicamentos que coincidan con la búsqueda."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {visibles.map((medicamento) => (
                  <TableRow key={medicamento.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{medicamento.nombre}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {medicamento.laboratorio || "—"}
                    </TableCell>
                    <TableCell>{medicamento.categoria || "—"}</TableCell>
                    <TableCell align="right">{formatearPrecio(medicamento.precio)}</TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={medicamento.stock}
                        color={medicamento.stock <= STOCK_BAJO ? "warning" : "default"}
                      />
                    </TableCell>
                    <TableCell>{formatearFecha(medicamento.fecha_vencimiento)}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label={`Editar ${medicamento.nombre}`}
                          onClick={() => abrirFormEditar(medicamento)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          aria-label={`Eliminar ${medicamento.nombre}`}
                          color="error"
                          onClick={() => setMedicamentoAEliminar(medicamento)}
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

      <MedicamentoForm
        abierto={formAbierto}
        medicamento={medicamentoEditando}
        onCerrar={() => setFormAbierto(false)}
        onGuardado={alGuardar}
      />

      <DialogoConfirmacion
        abierto={Boolean(medicamentoAEliminar)}
        titulo="Eliminar medicamento"
        mensaje={`¿Seguro que querés eliminar «${medicamentoAEliminar?.nombre ?? ""}»? Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setMedicamentoAEliminar(null)}
      />
    </>
  );
}