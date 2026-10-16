const aISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// "vencido" | "pronto" (dentro de `dias` días) | "ok" | null (sin fecha)
export function estadoVencimiento(iso, dias = 30) {
  if (!iso) return null;
  const limite = new Date();
  limite.setDate(limite.getDate() + dias);
  if (iso < aISO(new Date())) return "vencido";
  return iso <= aISO(limite) ? "pronto" : "ok";
}
