import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../common/Logo";
import { colores } from "../../theme";
import { itemsMenu } from "./navegacion";
import { useAuth } from "../../context/AuthContext";
import { useNotificacion } from "../../context/NotificacionContext";

const ANCHO_MENU = 256;
const ETIQUETA_ROL = { admin: "Administración", empleado: "Empleado" };

// Marco de la app: barra lateral azul oscuro + zona de contenido (<Outlet />).
export default function Layout() {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const { pathname } = useLocation();
  const estaActivo = (ruta) => (ruta === "/" ? pathname === "/" : pathname.startsWith(ruta));

  const { usuario, cerrarSesion } = useAuth();
  const notificar = useNotificacion();
  // Cada rol ve solo los módulos que le corresponden
  const itemsVisibles = itemsMenu.filter((item) => !item.roles || item.roles.includes(usuario?.rol));

  const salir = async () => {
    setMenuMovilAbierto(false);
    await cerrarSesion();
    notificar.exito("Sesión cerrada correctamente");
  };

  const menu = (
    <Box component="nav" aria-label="Navegación principal" sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: colores.azulOscuro, color: "#fff" }}>
      <Toolbar sx={{ px: 3, py: 2.5 }}>
        <Logo sobreOscuro />
      </Toolbar>
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {itemsVisibles.map(({ texto, ruta, icono: Icono }) => (
          <ListItemButton
            key={ruta}
            component={NavLink}
            to={ruta}
            selected={estaActivo(ruta)}
            onClick={() => setMenuMovilAbierto(false)}
            sx={{
              borderRadius: 2, mb: 0.5, color: "rgba(255,255,255,0.78)", borderLeft: "3px solid transparent",
              "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              "&.Mui-selected": {
                bgcolor: "rgba(22,168,120,0.18)", color: "#fff", borderLeftColor: colores.verde,
                "&:hover": { bgcolor: "rgba(22,168,120,0.26)" },
                "& .MuiListItemIcon-root": { color: colores.verde },
              },
              "&.Mui-focusVisible": { outline: "2px solid #fff" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <Icono fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={texto} slotProps={{ primary: { fontWeight: 500 } }} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {ETIQUETA_ROL[usuario?.rol] ?? "Sesión"}
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)", wordBreak: "break-all" }}>
          {usuario?.email}
        </Typography>
        <ListItemButton
          onClick={salir}
          sx={{ mt: 1, px: 1.5, borderRadius: 2, color: "rgba(255,255,255,0.78)", "&:hover": { bgcolor: "rgba(255,255,255,0.06)" } }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" slotProps={{ primary: { fontWeight: 500 } }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  const papel = { width: ANCHO_MENU, boxSizing: "border-box", bgcolor: colores.azulOscuro, borderRight: 0 };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" elevation={0} sx={{ display: { md: "none" }, bgcolor: colores.azulOscuro }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="Abrir menú" onClick={() => setMenuMovilAbierto(true)} sx={{ mr: 1.5 }}>
            <MenuIcon />
          </IconButton>
          <Logo sobreOscuro />
        </Toolbar>
      </AppBar>

      <Drawer variant="temporary" open={menuMovilAbierto} onClose={() => setMenuMovilAbierto(false)}
        ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": papel }}>
        {menu}
      </Drawer>
      <Drawer variant="permanent" open sx={{ display: { xs: "none", md: "block" }, width: ANCHO_MENU, flexShrink: 0, "& .MuiDrawer-paper": papel }}>
        {menu}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 4 } }}>
        <Toolbar sx={{ display: { md: "none" } }} />
        <Box sx={{ maxWidth: 1100, mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}