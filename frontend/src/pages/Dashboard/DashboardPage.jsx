import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { obtenerResumen } from "../../api/dashboardApi";
import EncabezadoPagina from "../../components/common/EncabezadoPagina";
import { obtenerMensajeError } from "../../utils/errores";

// Fecha "2026-10-30" -> "30/10/2026" (sin pasar por Date para evitar desfases de zona horaria)
const formatearFecha = (iso) => (iso ? iso.split("-").reverse().join("/") : "—");

// Tarjeta con un número grande (cantidad de registros)
function TarjetaResumen({ titulo, valor, icono }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <Box sx={{ color: "primary.main", display: "flex" }}>{icono}</Box>
      <Box>
        <Typography variant="h4" component="p" sx={{ fontWeight: 600 }}>
          {valor}
        </Typography>
        <Typography color="text.secondary">{titulo}</Typography>
      </Box>
    </Paper>
  );
}

// Lista de medicamentos (stock bajo / por vencer)
function ListaMedicamentos({ titulo, medicamentos, detalle, vacio }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {titulo}
      </Typography>
      {medicamentos.length === 0 ? (
        <Typography color="text.secondary">{vacio}</Typography>
      ) : (
        <List dense disablePadding>
          {medicamentos.map((m) => (
            <ListItem key={m.id} disableGutters>
              <ListItemText primary={m.nombre} secondary={detalle(m)} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

// Los números vienen del backend: GET /api/dashboard
//   { medicamentos, categorias, empleados, stock_bajo: [...], por_vencer: [...] }
export default function DashboardPage() {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const cargarResumen = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");
    try {
      setResumen(await obtenerResumen());
    } catch (error) {
      setErrorCarga(obtenerMensajeError(error, "Error al cargar el dashboard"));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  return (
    <>
      <EncabezadoPagina titulo="Dashboard" descripcion="Resumen general de la farmacia." />

      {errorCarga && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={cargarResumen}>
              Reintentar
            </Button>
          }
        >
          {errorCarga}
        </Alert>
      )}

      {cargando && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
          <CircularProgress aria-label="Cargando dashboard" />
        </Box>
      )}

      {!cargando && resumen && (
        <>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <TarjetaResumen
              titulo="Medicamentos"
              valor={resumen.medicamentos}
              icono={<MedicationOutlinedIcon fontSize="large" />}
            />
            <TarjetaResumen
              titulo="Categorías"
              valor={resumen.categorias}
              icono={<CategoryOutlinedIcon fontSize="large" />}
            />
            <TarjetaResumen
              titulo="Empleados"
              valor={resumen.empleados}
              icono={<BadgeOutlinedIcon fontSize="large" />}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              mt: 3,
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            <ListaMedicamentos
              titulo="Stock bajo"
              medicamentos={resumen.stock_bajo ?? []}
              detalle={(m) => `Quedan ${m.stock} unidades`}
              vacio="No hay medicamentos con stock bajo."
            />
            <ListaMedicamentos
              titulo="Por vencer (próximos 30 días)"
              medicamentos={resumen.por_vencer ?? []}
              detalle={(m) => `Vence el ${formatearFecha(m.fecha_vencimiento)}`}
              vacio="No hay medicamentos por vencer."
            />
          </Box>
        </>
      )}
    </>
  );
}