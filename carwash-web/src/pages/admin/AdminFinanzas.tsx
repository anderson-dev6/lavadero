import { useMemo, useState } from 'react'
import { useServicios } from '../../context/ServiciosContext'
import {
  finMesISO,
  finSemanaISO,
  hoyISO,
  inicioMesISO,
  inicioSemanaISO,
} from '../../lib/dates'
import { labelServicio } from '../../lib/labels'
import type { ServiceType } from '../../types/carwash'

type Periodo = 'dia' | 'semana' | 'mes'

export function AdminFinanzas() {
  const { servicios } = useServicios()
  const [periodo, setPeriodo] = useState<Periodo>('dia')
  const [ref, setRef] = useState(hoyISO())

  const rango = useMemo(() => {
    if (periodo === 'dia') return { desde: ref, hasta: ref }
    if (periodo === 'semana') {
      const ini = inicioSemanaISO(ref)
      return { desde: ini, hasta: finSemanaISO(ini) }
    }
    return { desde: inicioMesISO(ref), hasta: finMesISO(ref) }
  }, [periodo, ref])

  const completados = useMemo(() => {
    return servicios.filter(
      (s) =>
        s.estado === 'completado' &&
        s.fecha >= rango.desde &&
        s.fecha <= rango.hasta,
    )
  }, [servicios, rango])

  const total = completados.reduce((a, s) => a + s.precio, 0)
  const promedio =
    completados.length > 0 ? Math.round(total / completados.length) : 0

  const porTipo = useMemo(() => {
    const m = new Map<string, { count: number; sum: number }>()
    for (const s of completados) {
      const k = s.tipoServicio
      const cur = m.get(k) ?? { count: 0, sum: 0 }
      cur.count += 1
      cur.sum += s.precio
      m.set(k, cur)
    }
    return [...m.entries()].sort((a, b) => b[1].sum - a[1].sum)
  }, [completados])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Finanzas (RF-03)
        </h1>
        <p className="text-slate-600">
          Resumen por día, semana o mes. Exportación PDF/Excel cuando exista
          backend.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="text-sm">
          <span className="font-medium text-slate-700">Periodo</span>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as Periodo)}
            className="mt-1 block rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">
            {periodo === 'mes' ? 'Mes (cualquier día)' : 'Fecha referencia'}
          </span>
          <input
            type="date"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            className="mt-1 block rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <p className="text-sm text-slate-600">
          Rango: <strong>{rango.desde}</strong> → <strong>{rango.hasta}</strong>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Ingresos</p>
          <p className="text-xl font-bold text-sky-800">
            ${total.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Servicios completados</p>
          <p className="text-xl font-bold text-slate-800">{completados.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Promedio por servicio</p>
          <p className="text-xl font-bold text-slate-800">
            ${promedio.toLocaleString('es-CO')}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Servicios más rentables (por tipo)
        </h2>
        <ul className="mt-3 space-y-2">
          {porTipo.map(([tipo, v]) => (
            <li
              key={tipo}
              className="flex justify-between border-b border-slate-100 py-2 text-sm"
            >
              <span>{labelServicio(tipo as ServiceType)}</span>
              <span className="text-slate-600">
                {v.count} · ${v.sum.toLocaleString('es-CO')}
              </span>
            </li>
          ))}
          {porTipo.length === 0 ? (
            <li className="text-slate-500">Sin datos en este rango.</li>
          ) : null}
        </ul>
      </section>

      <p className="text-sm text-slate-500">
        Botones “Exportar PDF / Excel” se habilitarán con la API (RNF).
      </p>
    </div>
  )
}
