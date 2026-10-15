import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import MedicamentosPage from "./pages/Medicamentos/MedicamentosPage";
import CategoriasPage from "./pages/Categorias/CategoriasPage";
import EmpleadosPage from "./pages/Empleados/EmpleadosPage";
import NoEncontradaPage from "./pages/NoEncontrada/NoEncontradaPage";

// Mapa de pantallas. Todas se dibujan dentro del Layout (menú lateral).
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="medicamentos" element={<MedicamentosPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="empleados" element={<EmpleadosPage />} />
        <Route path="*" element={<NoEncontradaPage />} />
      </Route>
    </Routes>
  );
}
