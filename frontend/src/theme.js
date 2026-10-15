import { createTheme } from "@mui/material/styles";

// Paleta: verde azulado profundo (identidad de farmacia sin caer en el verde cruz),
// fondo gris azulado muy claro para que las tablas y formularios resalten.
const theme = createTheme({
  palette: {
    primary: { main: "#0B6E69", light: "#3F9A94", dark: "#07514D", contrastText: "#FFFFFF" },
    secondary: { main: "#B45309" },
    error: { main: "#C0392B" },
    background: { default: "#F2F5F6", paper: "#FFFFFF" },
    text: { primary: "#16282A", secondary: "#51666A" },
    divider: "#DCE4E6",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Public Sans", "Segoe UI", Roboto, Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 700, letterSpacing: "-0.005em" },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, color: "#51666A", backgroundColor: "#F7F9FA" },
      },
    },
    MuiDialog: {
      defaultProps: { fullWidth: true, maxWidth: "sm" },
    },
  },
});

export default theme;
