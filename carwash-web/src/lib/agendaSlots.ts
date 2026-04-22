/** Capacidad por franja horaria (RF-02). */
export const CAPACIDAD_POR_HORA = 3

export const HORAS_ATENCION = Array.from({ length: 10 }, (_, i) => i + 8)

export function slotKey(fecha: string, hora: number): string {
  return `${fecha}T${String(hora).padStart(2, '0')}:00`
}

/** Cuenta reservas activas (pendiente o confirmada) en esa franja. */
export function ocupacionEnSlot(
  reservas: { fechaHora: string; estado: string }[],
  fecha: string,
  hora: number,
): number {
  const prefix = `${fecha}T${String(hora).padStart(2, '0')}`
  return reservas.filter(
    (r) =>
      r.fechaHora.startsWith(prefix) &&
      (r.estado === 'pendiente' || r.estado === 'confirmada'),
  ).length
}

export function horasDisponiblesParaFecha(
  reservas: { fechaHora: string; estado: string }[],
  fecha: string,
): number[] {
  return HORAS_ATENCION.filter(
    (h) => ocupacionEnSlot(reservas, fecha, h) < CAPACIDAD_POR_HORA,
  )
}
