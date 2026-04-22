export function hoyISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function horaActual(): string {
  const d = new Date()
  return d.toTimeString().slice(0, 5)
}

export function inicioSemanaISO(ref: string): string {
  const d = new Date(ref + 'T12:00:00')
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().slice(0, 10)
}

export function finSemanaISO(inicio: string): string {
  const d = new Date(inicio + 'T12:00:00')
  d.setDate(d.getDate() + 6)
  return d.toISOString().slice(0, 10)
}

export function inicioMesISO(ref: string): string {
  return ref.slice(0, 7) + '-01'
}

export function finMesISO(ref: string): string {
  const [y, m] = ref.slice(0, 7).split('-').map(Number)
  const last = new Date(y, m, 0)
  return last.toISOString().slice(0, 10)
}
