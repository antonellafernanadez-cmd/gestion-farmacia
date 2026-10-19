import { Box, Typography } from "@mui/material";
import { colores } from "../../theme";

// Logo de ValkiFarm: cápsula sobre fondo verde + nombre. `compacto` muestra solo el símbolo.
export default function Logo({ compacto = false, sobreOscuro = false }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }} role="img" aria-label="ValkiFarm">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <rect width="34" height="34" rx="9" fill={colores.verde} />
        <g transform="rotate(-45 17 17)">
          <rect x="6" y="11.5" width="22" height="11" rx="5.5" fill="#fff" />
          <path d="M17 11.5h6.5a5.5 5.5 0 0 1 0 11H17z" fill={colores.verdeOscuro} />
        </g>
      </svg>
      {!compacto && (
        <Typography variant="h6" component="span" sx={{ color: sobreOscuro ? "#fff" : colores.azulOscuro, fontWeight: 700 }}>
          Valki<Box component="span" sx={{ color: colores.verde }}>Farm</Box>
        </Typography>
      )}
    </Box>
  );
}
