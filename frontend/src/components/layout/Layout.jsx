import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import { itemsMenu } from "./navegacion";

const ANCHO_MENU = 248;

// Marco general de la aplicación: menú lateral + zona de contenido.
// Cada página se dibuja dentro de <Outlet />.
export default function Layout() {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const { pathname } = useLocation();

  const estaActivo = (ruta) =>
    ruta === "/" ? pathname === "/" : pathname.startsWith(ruta);

  const menu = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ gap: 1.5, px: 3 }}>
        <LocalPharmacyOutlinedIcon color="primary" />
        <Typography variant="h6" color="primary.dark">
          Farmacia
        </Typography>
      </Toolbar>
      <List sx={{ px: 1.5 }}>
        {itemsMenu.map(({ texto, ruta, icono: Icono }) => (
          <ListItemButton
            key={ruta}
            component={NavLink}
            to={ruta}
            selected={estaActivo(ruta)}
            onClick={() => setMenuMovilAbierto(false)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                "&:hover": { backgroundColor: "primary.dark" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icono fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={texto} slotProps={{ primary: { fontWeight: 500 } }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Barra superior: solo en pantallas chicas */}
      <AppBar
        position="fixed"
        color="inherit"
        sx={{ display: { md: "none" }, borderBottom: 1, borderColor: "divider" }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="Abrir menú"
            onClick={() => setMenuMovilAbierto(true)}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="primary.dark">
            Farmacia
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Menú temporal (celular) */}
      <Drawer
        variant="temporary"
        open={menuMovilAbierto}
        onClose={() => setMenuMovilAbierto(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: ANCHO_MENU },
        }}
      >
        {menu}
      </Drawer>

      {/* Menú fijo (escritorio) */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: ANCHO_MENU,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: ANCHO_MENU,
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
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
