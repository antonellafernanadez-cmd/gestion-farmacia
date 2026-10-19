import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import empleadosApi from "../../api/empleadosApi";
import { obtenerMensajeError } from "../../utils/errores";

const VACIO = { nombre: "", apellido: "", dni: "", email: "", cargo: "", domicilio: "" };

// Mismas reglas que el backend (empleado_controller.py). El backend valida
// de nuevo por seguridad, pero así el usuario ve el error al instante.
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validar(datos) {
  const errores = {};
  if (!datos.nombre.trim()) errores.nombre = "El nombre es obligatorio";
  if (!datos.apellido.trim()) errores.apellido = "El apellido es obligatorio";
  if (!datos.dni.trim()) {
    errores.dni = "El DNI es obligatorio";
  } else if (!/^\d{7,8}$/.test(datos.dni.trim())) {
    errores.dni = "El DNI debe tener 7 u 8 números";
  }
  if (!datos.email.trim()) {
    errores.email = "El email es obligatorio";
  } else if (!EMAIL_RE.test(datos.email.trim())) {
    errores.email = "El email no es válido";
  }
  if (!datos.cargo.trim()) errores.cargo = "El cargo es obligatorio";
  return errores;
}

// Formulario en ventana emergente para crear o editar un empleado.
// - empleado = null  -> modo "crear"
// - empleado = {...} -> modo "editar"
export default function EmpleadoForm({ abierto, empleado, onCerrar, onGuardado }) {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Cada vez que se abre, se cargan los datos del empleado (o se vacía el formulario).
  useEffect(() => {
    if (abierto) {
      setDatos({
        nombre: empleado?.nombre ?? "",
        apellido: empleado?.apellido ?? "",
        dni: empleado?.dni ?? "",
        email: empleado?.email ?? "",
        cargo: empleado?.cargo ?? "",
        domicilio: empleado?.domicilio ?? "",
      });
      setErrores({});
      setErrorServidor("");
    }
  }, [abierto, empleado]);

  // Devuelve el onChange de un campo y borra su error al escribir.
  const cambiar = (campo) => (evento) => {
    setDatos((previo) => ({ ...previo, [campo]: evento.target.value }));
    setErrores((previo) => ({ ...previo, [campo]: "" }));
  };

  const guardar = async (evento) => {
    evento.preventDefault();

    const erroresEncontrados = validar(datos);
    if (Object.keys(erroresEncontrados).length > 0) {
      setErrores(erroresEncontrados);
      return;
    }

    setGuardando(true);
    setErrorServidor("");
    const cuerpo = {
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      dni: datos.dni.trim(),
      email: datos.email.trim(),
      cargo: datos.cargo.trim(),
      domicilio: datos.domicilio.trim(),
    };

    try {
      const respuesta = empleado
        ? await empleadosApi.modificar(empleado.id, cuerpo)
        : await empleadosApi.crear(cuerpo);
      onGuardado(respuesta.mensaje);
    } catch (error) {
      // Por ejemplo: 409 "Ya existe un empleado con ese DNI"
      setErrorServidor(obtenerMensajeError(error, "No se pudo guardar el empleado"));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={abierto} onClose={guardando ? undefined : onCerrar}>
      <form onSubmit={guardar} noValidate>
        <DialogTitle>{empleado ? "Editar empleado" : "Nuevo empleado"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {errorServidor && <Alert severity="error">{errorServidor}</Alert>}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.5,
              }}
            >
              <TextField
                label="Nombre"
                value={datos.nombre}
                onChange={cambiar("nombre")}
                error={Boolean(errores.nombre)}
                helperText={errores.nombre}
                required
                autoFocus
                slotProps={{ htmlInput: { maxLength: 50 } }}
              />
              <TextField
                label="Apellido"
                value={datos.apellido}
                onChange={cambiar("apellido")}
                error={Boolean(errores.apellido)}
                helperText={errores.apellido}
                required
                slotProps={{ htmlInput: { maxLength: 50 } }}
              />
              <TextField
                label="DNI"
                value={datos.dni}
                onChange={cambiar("dni")}
                error={Boolean(errores.dni)}
                helperText={errores.dni || "Solo números, sin puntos"}
                required
                slotProps={{ htmlInput: { maxLength: 8, inputMode: "numeric" } }}
              />
              <TextField
                label="Cargo"
                value={datos.cargo}
                onChange={cambiar("cargo")}
                error={Boolean(errores.cargo)}
                helperText={errores.cargo || "Por ejemplo: Farmacéutico"}
                required
                slotProps={{ htmlInput: { maxLength: 50 } }}
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              value={datos.email}
              onChange={cambiar("email")}
              error={Boolean(errores.email)}
              helperText={errores.email}
              required
              slotProps={{ htmlInput: { maxLength: 120 } }}
            />
            <TextField
              label="Domicilio (opcional)"
              value={datos.domicilio}
              onChange={cambiar("domicilio")}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCerrar} disabled={guardando} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={guardando}>
            {guardando ? "Guardando…" : empleado ? "Guardar cambios" : "Crear empleado"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
