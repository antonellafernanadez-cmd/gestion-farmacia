import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

// Items del menú lateral. Para agregar una pantalla nueva: sumar acá el item
// y registrar su <Route> en App.jsx.
export const itemsMenu = [
  { texto: "Dashboard", ruta: "/", icono: DashboardOutlinedIcon },
  { texto: "Medicamentos", ruta: "/medicamentos", icono: MedicationOutlinedIcon },
  { texto: "Categorías", ruta: "/categorias", icono: CategoryOutlinedIcon },
  { texto: "Empleados", ruta: "/empleados", icono: BadgeOutlinedIcon },
];
