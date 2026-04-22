import { useCallback, useEffect, useMemo, useState } from 'react'
import { useServicios } from '../../context/ServiciosContext'
import { hoyISO } from '../../lib/dates'
import {
  fetchEmpleados,
  insertEmpleado,
  setEmpleadoActivo,
  type EmpleadoRow,
} from '../../lib/empleadosApi'

export function AdminEmpleados() {
  const { servicios } = useServicios()
  const [lista, setLista] = useState<EmpleadoRow[]>([])
  const [nombre, setNombre] = useState('')

  const reload = useCallback(async () => {
    setLista(await fetchEmpleados())
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const stats = useMemo(() => {
    const hoy = hoyISO()
    const map = new Map<string, number>()
    for (const s of servicios) {
      if (s.fecha !== hoy || s.estado !== 'completado') continue
      const k = s.empleadoAsignado
      map.set(k, (map.get(k) ?? 0) + 1)
    }
    return map
  }, [servicios])

  async function agregar(e: React.FormEvent) {
    e.preventDefault()
    const n = nombre.trim()
    if (!n) return
    if (lista.some((x) => x.nombre.toLowerCase() === n.toLowerCase())) {
      return
    }
    const ok = await insertEmpleado(n)
    if (ok) {
      setNombre('')
      await reload()
    }
  }

  async function toggleActivo(emp: EmpleadoRow) {
    const ok = await setEmpleadoActivo(emp.id, !emp.activo)
    if (ok) await reload()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Empleados (RF-05)
        </h1>
        <p className="text-slate-600">
          Alta y activación. Servicios completados hoy por nombre.
        </p>
      </div>

      <form
        onSubmit={agregar}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <label className="text-sm">
          <span className="font-medium text-slate-700">Nombre</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Nuevo empleado"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
        >
          Agregar
        </button>
      </form>

      <ul className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {lista.map((emp) => (
          <li
            key={emp.id}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-3 last:border-0"
          >
            <div>
              <p className="font-medium text-slate-800">{emp.nombre}</p>
              <p className="text-sm text-slate-500">
                Completados hoy: {stats.get(emp.nombre) ?? 0}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void toggleActivo(emp)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                emp.activo
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {emp.activo ? 'Activo' : 'Inactivo'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
