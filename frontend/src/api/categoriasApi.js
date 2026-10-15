import { crearApiCrud } from "./crudApi";

// listar, obtener, crear, modificar, eliminar  ->  /api/categorias
const categoriasApi = crearApiCrud("categorias");

export default categoriasApi;
