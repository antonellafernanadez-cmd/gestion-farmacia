import PaginaPendiente from "../../components/common/PaginaPendiente";

// TODO (rama feature/medicamentos): CRUD completo de medicamentos.
// API lista para usar: src/api/medicamentosApi.js (y categoriasApi.js para el selector).
export default function MedicamentosPage() {
  return (
    <PaginaPendiente
      titulo="Medicamentos"
      descripcion="Administrá el stock y los precios de los medicamentos."
      tareas={[
        "Tabla con nombre, laboratorio, precio, stock, vencimiento y categoría",
        "Formulario de alta y edición, con selector de categoría",
        "Validaciones: nombre obligatorio, precio mayor a 0, stock no negativo, categoría obligatoria, fecha válida",
        "Eliminar con confirmación",
      ]}
    />
  );
}
