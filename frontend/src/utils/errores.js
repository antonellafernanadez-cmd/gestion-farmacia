// Convierte un error de Axios en un mensaje legible para mostrarle al usuario.
// El backend responde los errores como { "error": "mensaje" }.
export function obtenerMensajeError(error, porDefecto = "Ocurrió un error inesperado") {
  const mensajeBackend = error?.response?.data?.error;
  if (mensajeBackend) return mensajeBackend;

  if (error?.code === "ERR_NETWORK" || error?.code === "ECONNABORTED") {
    return "No se pudo conectar con el servidor. Verificá que el backend esté en ejecución.";
  }
  return porDefecto;
}
