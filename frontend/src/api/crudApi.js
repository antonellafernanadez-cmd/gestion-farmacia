import apiClient from "./axiosClient";

// Devuelve directamente el cuerpo JSON de la respuesta (response.data).
const datos = (peticion) => peticion.then((respuesta) => respuesta.data);

// Genera las 5 llamadas del CRUD para un recurso de la API.
// Ejemplo: crearApiCrud("categorias") arma GET/POST/PUT/DELETE sobre /api/categorias
export function crearApiCrud(recurso) {
  return {
    listar: () => datos(apiClient.get(`/${recurso}`)),
    obtener: (id) => datos(apiClient.get(`/${recurso}/${id}`)),
    crear: (cuerpo) => datos(apiClient.post(`/${recurso}`, cuerpo)),
    modificar: (id, cuerpo) => datos(apiClient.put(`/${recurso}/${id}`, cuerpo)),
    eliminar: (id) => datos(apiClient.delete(`/${recurso}/${id}`)),
  };
}
