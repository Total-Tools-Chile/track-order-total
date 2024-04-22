export function formatCLP(value) {
  const formatter = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0 // Esto elimina los decimales, común en la presentación de CLP
  });

  return formatter.format(value);
}
