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
import empleadosApi from "../../api/empleadosApi";
import EncabezadoPagina from "../../components/common/EncabezadoPagina";
import DialogoConfirmacion from "../../components/common/DialogoConfirmacion";
import { useNotificacion } from "../../context/NotificacionContext";
import { obtenerMensajeError } from "../../utils/errores";
import EmpleadoForm from "./EmpleadoForm";

// Pantalla de Empleados: mismo patrón que Categorías.
//   1. Cargar la lista desde la API al abrir la pantalla.
//   2. Mostrarla en una tabla (con estados: cargando, error y vacío).
//   3. Formulario en Dialog para crear/editar.
//   4. Confirmación antes de eliminar.
//   5. Snackbar con el resultado de cada operación.
export default function EmpleadosPage() {
  const notificar = useNotificacion();

  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [formAbierto, setFormAbierto] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);

  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarEmpleados = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");
    try {
      setEmpleados(await empleadosApi.listar());
    } catch (error) {
      setErrorCarga(obtenerMensajeError(error, "Error al cargar los empleados"));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  const abrirFormNuevo = () => {
    setEmpleadoEditando(null);
    setFormAbierto(true);
  };

  const abrirFormEditar = (empleado) => {
    setEmpleadoEditando(empleado);
    setFormAbierto(true);
  };

  const alGuardar = (mensaje) => {
    setFormAbierto(false);
    notificar.exito(mensaje);
    cargarEmpleados();
  };

  const confirmarEliminar = async () => {
    setEliminando(true);
    try {
      const respuesta = await empleadosApi.eliminar(empleadoAEliminar.id);
      notificar.exito(respuesta.mensaje);
      setEmpleadoAEliminar(null);
      cargarEmpleados();
    } catch (error) {
      notificar.error(obtenerMensajeError(error, "No se pudo eliminar el empleado"));
      setEmpleadoAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      <EncabezadoPagina
        titulo="Empleados"
        descripcion="Administrá el personal de la farmacia."
        accion={
          <Button variant="contained" startIcon={<AddIcon />} onClick={abrirFormNuevo}>
            Nuevo empleado
          </Button>
        }
      />

      {errorCarga && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={cargarEmpleados}>
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
            <CircularProgress aria-label="Cargando empleados" />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Apellido y nombre</TableCell>
                  <TableCell>DNI</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Domicilio</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {empleados.length === 0 && !errorCarga && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        Todavía no hay empleados. Cargá el primero con el botón «Nuevo empleado».
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {empleados.map((empleado) => (
                  <TableRow key={empleado.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {empleado.apellido}, {empleado.nombre}
                    </TableCell>
                    <TableCell>{empleado.dni}</TableCell>
                    <TableCell>{empleado.email}</TableCell>
                    <TableCell>{empleado.cargo}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {empleado.domicilio || "—"}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label={`Editar a ${empleado.nombre} ${empleado.apellido}`}
                          onClick={() => abrirFormEditar(empleado)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          aria-label={`Eliminar a ${empleado.nombre} ${empleado.apellido}`}
                          color="error"
                          onClick={() => setEmpleadoAEliminar(empleado)}
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

      <EmpleadoForm
        abierto={formAbierto}
        empleado={empleadoEditando}
        onCerrar={() => setFormAbierto(false)}
        onGuardado={alGuardar}
      />

      <DialogoConfirmacion
        abierto={Boolean(empleadoAEliminar)}
        titulo="Eliminar empleado"
        mensaje={`¿Seguro que querés eliminar a ${empleadoAEliminar?.nombre ?? ""} ${empleadoAEliminar?.apellido ?? ""}? Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setEmpleadoAEliminar(null)}
      />
    </>
  );
}
