import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

// Solo módulos que existen. Para sumar uno: agregar el item acá y su <Route> en App.jsx.
// `roles` limita quién lo ve en el menú; sin `roles`, lo ven todos los que tengan sesión.
export const itemsMenu = [
  { texto: "Inicio", ruta: "/", icono: HomeOutlinedIcon },
  { texto: "Dashboard", ruta: "/dashboard", icono: DashboardOutlinedIcon },
  { texto: "Medicamentos", ruta: "/medicamentos", icono: MedicationOutlinedIcon },
  { texto: "Categorías", ruta: "/categorias", icono: CategoryOutlinedIcon },
  { texto: "Empleados", ruta: "/empleados", icono: BadgeOutlinedIcon, roles: ["admin"] },
];
