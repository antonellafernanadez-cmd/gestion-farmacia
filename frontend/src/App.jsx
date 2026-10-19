import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import RutaProtegida from "./components/auth/RutaProtegida";
import LoginPage from "./pages/Login/LoginPage";
import InicioPage from "./pages/Inicio/InicioPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import MedicamentosPage from "./pages/Medicamentos/MedicamentosPage";
import CategoriasPage from "./pages/Categorias/CategoriasPage";
import EmpleadosPage from "./pages/Empleados/EmpleadosPage";
import NoEncontradaPage from "./pages/NoEncontrada/NoEncontradaPage";

// Mapa de pantallas. Todas, salvo el login, exigen sesión y se dibujan dentro del Layout (menú lateral).
// Empleados es solo para el rol "admin".
export default function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route index element={<InicioPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="medicamentos" element={<MedicamentosPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route
          path="empleados"
          element={
            <RutaProtegida roles={["admin"]}>
              <EmpleadosPage />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<NoEncontradaPage />} />
      </Route>
    </Routes>
  );
}