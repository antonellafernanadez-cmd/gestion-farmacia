import { crearApiCrud } from "./crudApi";

// listar, obtener, crear, modificar, eliminar  ->  /api/empleados
const empleadosApi = crearApiCrud("empleados");

export default empleadosApi;
