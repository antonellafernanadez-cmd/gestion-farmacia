import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardActionArea, CircularProgress, InputAdornment, List, ListItem,
  ListItemText, Paper, TextField, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { obtenerResumen } from "../../api/dashboardApi";
import { obtenerMensajeError } from "../../utils/errores";
import { useAuth } from "../../context/AuthContext";
import { colores } from "../../theme";

// Solo accesos a pantallas que existen.
const accesos = [
  { titulo: "Registrar medicamento", detalle: "Dar de alta un nuevo producto", ruta: "/medicamentos?nuevo=1", icono: AddCircleOutlineIcon },
  { titulo: "Consultar medicamentos", detalle: "Ver, editar y eliminar", ruta: "/medicamentos", icono: MedicationOutlinedIcon },
  { titulo: "Categorías", detalle: "Organizar los productos", ruta: "/categorias", icono: CategoryOutlinedIcon },
  { titulo: "Empleados", detalle: "Gestionar el personal", ruta: "/empleados", icono: BadgeOutlinedIcon, roles: ["admin"] },
  { titulo: "Dashboard", detalle: "Resumen general", ruta: "/dashboard", icono: DashboardOutlinedIcon },
];

const fecha = (iso) => (iso ? iso.split("-").reverse().join("/") : "—");
const hoyISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Bloque de alerta: se distingue por color, icono y texto (no solo por color).
function BloqueAlerta({ nivel, titulo, items, detalle }) {
  const critico = nivel === "critico";
  const color = critico ? colores.error : "#9A6A00";
  const Icono = critico ? ErrorOutlineIcon : WarningAmberIcon;
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderLeft: `4px solid ${critico ? colores.error : colores.aviso}` }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color }}>
        <Icono fontSize="small" />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {critico ? "Crítico" : "Atención"} · {items.length}
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ mt: 0.5 }}>{titulo}</Typography>
      {items.length === 0 ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, color: "primary.main" }}>
          <CheckCircleOutlineIcon fontSize="small" />
          <Typography variant="body2">Sin alertas</Typography>
        </Box>
      ) : (
        <List dense disablePadding sx={{ mt: 0.5 }}>
          {items.slice(0, 4).map((m) => (
            <ListItem key={m.id} disableGutters>
              <ListItemText primary={m.nombre} secondary={detalle(m)} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default function InicioPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  // Los accesos con `roles` solo los ve ese rol (ej.: Empleados es de administración)
  const accesosVisibles = accesos.filter((a) => !a.roles || a.roles.includes(usuario?.rol));
  const [texto, setTexto] = useState("");
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");
    try {
      setResumen(await obtenerResumen());
    } catch (e) {
      setErrorCarga(obtenerMensajeError(e, "Error al cargar las alertas"));
    } finally {
      setCargando(false);
    }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  // Busca por nombre: la lista de Medicamentos recibe el texto por la dirección (?buscar=...)
  const buscar = (e) => {
    e.preventDefault();
    const t = texto.trim();
    navigate(t ? `/medicamentos?buscar=${encodeURIComponent(t)}` : "/medicamentos");
  };

  const hoy = hoyISO();
  // El backend devuelve en por_vencer los que vencen en 30 días o ya vencieron; acá se separan.
  const vencidos = (resumen?.por_vencer ?? []).filter((m) => m.fecha_vencimiento < hoy);
  const porVencer = (resumen?.por_vencer ?? []).filter((m) => m.fecha_vencimiento >= hoy);

  return (
    <>
      <Typography variant="h4" component="h1">Bienvenido a ValkiFarm</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Gestioná tu farmacia de forma simple y segura</Typography>

      <Paper variant="outlined" component="form" role="search" onSubmit={buscar}
        sx={{ p: 1.5, display: "flex", gap: 1.5, flexWrap: "wrap", mb: 4, borderColor: "primary.light" }}>
        <TextField fullWidth size="medium" value={texto} onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar medicamento por nombre" sx={{ flex: "1 1 260px" }}
          slotProps={{ htmlInput: { "aria-label": "Buscar medicamento por nombre" },
            input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }} />
        <Button type="submit" variant="contained" size="large">Buscar</Button>
      </Paper>

      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>Accesos rápidos</Typography>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", mb: 4 }}>
        {accesosVisibles.map(({ titulo, detalle, ruta, icono: Icono }) => (
          <Card key={titulo} variant="outlined" sx={{ transition: "border-color .15s", "&:hover": { borderColor: "primary.light" } }}>
            <CardActionArea component={RouterLink} to={ruta} sx={{ p: 2.5, height: "100%" }}>
              <Box sx={{ display: "inline-flex", p: 1, mb: 1.5, borderRadius: 2, bgcolor: colores.menta, color: "primary.main" }}>
                <Icono />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>{titulo}</Typography>
              <Typography variant="body2" color="text.secondary">{detalle}</Typography>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>Alertas</Typography>
      {errorCarga && (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={cargar}>Reintentar</Button>}>{errorCarga}</Alert>
      )}
      {cargando && <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress aria-label="Cargando alertas" /></Box>}
      {!cargando && resumen && (
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <BloqueAlerta nivel="critico" titulo="Medicamentos vencidos" items={vencidos} detalle={(m) => `Venció el ${fecha(m.fecha_vencimiento)}`} />
          <BloqueAlerta nivel="atencion" titulo="Próximos a vencer (30 días)" items={porVencer} detalle={(m) => `Vence el ${fecha(m.fecha_vencimiento)}`} />
          <BloqueAlerta nivel="atencion" titulo="Stock bajo" items={resumen.stock_bajo ?? []} detalle={(m) => `Quedan ${m.stock} unidades`} />
        </Box>
      )}
    </>
  );
}
