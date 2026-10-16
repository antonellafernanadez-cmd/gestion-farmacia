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
import EstadoChip from "../../components/common/EstadoChip";
import { estadoVencimiento } from "../../utils/estados";
import { obtenerMensajeError } from "../../utils/errores";

// Fecha "2026-10-30" -> "30/10/2026" (sin pasar por Date para evitar desfases de zona horaria)
const formatearFecha = (iso) => (iso ? iso.split("-").reverse().join("/") : "—");

// Tarjeta con un número grande (cantidad de registros)
function TarjetaResumen({ titulo, valor, icono }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <Box sx={{ display: "flex", p: 1.5, borderRadius: 2.5, bgcolor: "#DDF5EA", color: "primary.main" }}>{icono}</Box>
      <Box>
        <Typography variant="h4" component="p" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{valor}</Typography>
        <Typography color="text.secondary">{titulo}</Typography>
      </Box>
    </Paper>
  );
}

// Lista de medicamentos (stock bajo / vencidos y por vencer), con etiqueta de estado
function ListaMedicamentos({ titulo, medicamentos, detalle, nivelDe, etiqueta, vacio }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>{titulo}</Typography>
      {medicamentos.length === 0 ? (
        <EstadoChip nivel="ok" label={vacio} />
      ) : (
        <List dense disablePadding>
          {medicamentos.map((m) => (
            <ListItem key={m.id} disableGutters sx={{ justifyContent: "space-between", gap: 1 }}>
              <ListItemText primary={m.nombre} secondary={detalle(m)} />
              <EstadoChip nivel={nivelDe(m)} label={etiqueta(m)} />
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
              nivelDe={(m) => (m.stock === 0 ? "critico" : "aviso")}
              etiqueta={(m) => (m.stock === 0 ? "Sin stock" : "Stock bajo")}
              vacio="Sin stock bajo"
            />
            <ListaMedicamentos
              titulo="Vencidos y por vencer (30 días)"
              medicamentos={resumen.por_vencer ?? []}
              detalle={(m) => `Fecha: ${formatearFecha(m.fecha_vencimiento)}`}
              nivelDe={(m) => (estadoVencimiento(m.fecha_vencimiento) === "vencido" ? "critico" : "aviso")}
              etiqueta={(m) => (estadoVencimiento(m.fecha_vencimiento) === "vencido" ? "Vencido" : "Por vencer")}
              vacio="Sin vencimientos"
            />
          </Box>
        </>
      )}
    </>
  );
}