import PaginaPendiente from "../../components/common/PaginaPendiente";

// TODO (rama feature/empleados): CRUD completo de empleados.
// API lista para usar: src/api/empleadosApi.js
export default function EmpleadosPage() {
  return (
    <PaginaPendiente
      titulo="Empleados"
      descripcion="Administrá el personal de la farmacia."
      tareas={[
        "Tabla con nombre, apellido, DNI, email, cargo y domicilio",
        "Formulario de alta y edición",
        "Validaciones: nombre, apellido, DNI y cargo obligatorios, email válido",
        "Eliminar con confirmación",
      ]}
    />
  );
}
