import { crearApiCrud } from "./crudApi";

// listar, obtener, crear, modificar, eliminar  ->  /api/medicamentos
const medicamentosApi = crearApiCrud("medicamentos");

export default medicamentosApi;
