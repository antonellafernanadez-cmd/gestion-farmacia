import { Chip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// Etiqueta de estado: se distingue por color, icono y texto (no solo por color).
const niveles = {
  critico: { Icono: ErrorOutlineIcon, fondo: "#FDECEC", texto: "#B83232" },
  aviso: { Icono: WarningAmberIcon, fondo: "#FEF3D9", texto: "#8A5A00" },
  ok: { Icono: CheckCircleOutlineIcon, fondo: "#DDF5EA", texto: "#0D6347" },
};

export default function EstadoChip({ nivel = "ok", label }) {
  const { Icono, fondo, texto } = niveles[nivel];
  return (
    <Chip size="small" label={label} icon={<Icono />}
      sx={{ bgcolor: fondo, color: texto, fontWeight: 600, "& .MuiChip-icon": { color: "inherit" } }} />
  );
}
