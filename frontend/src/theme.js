import { createTheme } from "@mui/material/styles";

// Identidad visual de ValkiFarm: todos los colores salen de acá.
export const colores = {
  azulOscuro: "#102A43", azulSecundario: "#243B53",
  verde: "#16A878", verdeOscuro: "#12805C", menta: "#DDF5EA",
  fondo: "#F3F7FA", superficie: "#FFFFFF",
  texto: "#243447", textoSecundario: "#64748B", borde: "#DCE5EB",
  info: "#2864B4", aviso: "#F4B740", error: "#DC4545",
};

// Los mismos colores como variables CSS (--vf-azul-oscuro, etc.)
const variablesCss = Object.fromEntries(
  Object.entries(colores).map(([k, v]) => [`--vf-${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`, v])
);

const theme = createTheme({
  palette: {
    // El verde oscuro es el principal en botones: con texto blanco cumple el contraste AA.
    primary: { main: colores.verdeOscuro, light: colores.verde, dark: "#0D6347", contrastText: "#fff" },
    secondary: { main: colores.info },
    info: { main: colores.info },
    warning: { main: colores.aviso, contrastText: colores.texto },
    error: { main: colores.error, dark: "#B83232" },
    success: { main: colores.verdeOscuro },
    background: { default: colores.fondo, paper: colores.superficie },
    text: { primary: colores.texto, secondary: colores.textoSecundario },
    divider: colores.borde,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Public Sans", "Segoe UI", Roboto, Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": variablesCss,
        // Respeta a quien pidió menos movimiento en su sistema
        "@media (prefers-reduced-motion: reduce)": {
          "*, *::before, *::after": { animationDuration: "0.01ms !important", transitionDuration: "0.01ms !important" },
        },
      },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { outlined: { borderColor: colores.borde } } },
    MuiTableCell: {
      styleOverrides: { head: { fontWeight: 600, color: colores.textoSecundario, backgroundColor: "#F8FAFC" } },
    },
    MuiDialog: { defaultProps: { fullWidth: true, maxWidth: "sm" } },
  },
});

export default theme;
