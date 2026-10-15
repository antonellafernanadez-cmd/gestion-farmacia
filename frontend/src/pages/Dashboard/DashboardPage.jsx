import PaginaPendiente from "../../components/common/PaginaPendiente";

// TODO (rama feature/dashboard): mostrar cantidad de medicamentos, categorías y empleados.
// El backend todavía no tiene GET /api/dashboard; la llamada ya está en src/api/dashboardApi.js
export default function DashboardPage() {
  return (
    <PaginaPendiente
      titulo="Dashboard"
      descripcion="Resumen general de la farmacia."
      tareas={[
        "Crear el endpoint GET /api/dashboard en el backend",
        "Tarjetas con la cantidad de medicamentos, categorías y empleados",
        "Estado de carga y mensaje de error si el backend no responde",
      ]}
    />
  );
}
