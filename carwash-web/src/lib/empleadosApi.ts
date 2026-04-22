import { supabase } from './supabase/client'

export type EmpleadoRow = {
  id: string
  nombre: string
  activo: boolean
}

export async function fetchEmpleados(): Promise<EmpleadoRow[]> {
  const { data, error } = await supabase
    .from('empleados')
    .select('id, nombre, activo')
    .order('nombre')

  if (error) {
    console.error(error)
    return []
  }
  return (data ?? []) as EmpleadoRow[]
}

export async function nombresEmpleadosActivos(): Promise<string[]> {
  const rows = await fetchEmpleados()
  return rows.filter((r) => r.activo).map((r) => r.nombre)
}

export async function insertEmpleado(nombre: string): Promise<boolean> {
  const { error } = await supabase.from('empleados').insert({
    nombre: nombre.trim(),
    activo: true,
  })
  if (error) {
    console.error(error)
    return false
  }
  return true
}

export async function setEmpleadoActivo(
  id: string,
  activo: boolean,
): Promise<boolean> {
  const { error } = await supabase.from('empleados').update({ activo }).eq('id', id)
  if (error) {
    console.error(error)
    return false
  }
  return true
}
