import { Link } from 'react-router-dom'
import { useInventario } from '../../context/InventarioContext'
import { useReservas } from '../../context/ReservasContext'
import { useServicios } from '../../context/ServiciosContext'
import { hoyISO } from '../../lib/dates'

function fmtMoney(n: number) {
  return `$${n.toLocaleString('es-CO')}`
}

export function AdminDashboard() {
  const { servicios } = useServicios()
  const { reservas } = useReservas()
  const { alertas } = useInventario()
  const hoy = hoyISO()

  const delDia = servicios.filter((s) => s.fecha === hoy)
  const completadosHoy = delDia.filter((s) => s.estado === 'completado')
  const ingresosHoy = completadosHoy.reduce((a, s) => a + s.precio, 0)
  const pendientesReserva = reservas.filter((r) => r.estado === 'pendiente')
  const enCola = delDia.filter((s) => s.estado !== 'completado').length

  const cards = [
    {
      label: 'Ingresos hoy',
      value: fmtMoney(ingresosHoy),
      hint: 'Servicios cobrados hoy',
      tone: 'sky' as const,
    },
    {
      label: 'Completados',
      value: String(completadosHoy.length),
      hint: 'Lavados finalizados',
      tone: 'slate' as const,
    },
    {
      label: 'En operación',
      value: String(enCola),
      hint: 'Pendientes o en proceso',
      tone: 'slate' as const,
    },
    {
      label: 'Reservas sin confirmar',
      value: String(pendientesReserva.length),
      hint: 'Requieren revisión',
      tone: 'amber' as const,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-800/80">
          Resumen operativo
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Vista general del día ({hoy}). Consulta ingresos, servicios y reservas
          desde el menú superior.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={[
              'rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md',
              c.tone === 'sky'
                ? 'border-sky-200/80 bg-gradient-to-br from-sky-50 to-white'
                : c.tone === 'amber'
                  ? 'border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white'
                  : 'border-slate-200/80 bg-white',
            ].join(' ')}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {c.label}
            </p>
            <p
              className={[
                'mt-2 text-3xl font-bold tabular-nums tracking-tight',
                c.tone === 'sky'
                  ? 'text-sky-900'
                  : c.tone === 'amber'
                    ? 'text-amber-900'
                    : 'text-slate-900',
              ].join(' ')}
            >
              {c.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{c.hint}</p>
          </div>
        ))}
      </div>

      {alertas.length > 0 ? (
        <div
          className="rounded-2xl border border-amber-200/90 bg-amber-50/90 p-5 shadow-sm sm:p-6"
          role="status"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-950">
                Inventario bajo mínimo
              </p>
              <ul className="mt-2 space-y-1 text-sm text-amber-950/85">
                {alertas.map((p) => (
                  <li key={p.id}>
                    {p.nombre}: {p.cantidadActual} {p.unidad} (mín. {p.cantidadMinima})
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/admin/inventario"
              className="shrink-0 rounded-lg bg-amber-900/90 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:bg-amber-950"
            >
              Gestionar stock
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/servicios"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-slate-900">Servicios del día</p>
          <p className="mt-2 text-sm text-slate-600">
            Registrar y seguir lavados, placa y estado en tiempo real.
          </p>
          <span className="mt-4 inline-flex items-center text-sm font-semibold text-sky-700 group-hover:underline">
            Abrir módulo →
          </span>
        </Link>
        <Link
          to="/admin/reservas"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-slate-900">Reservas</p>
          <p className="mt-2 text-sm text-slate-600">
            Confirmar o cancelar citas solicitadas por clientes.
          </p>
          <span className="mt-4 inline-flex items-center text-sm font-semibold text-sky-700 group-hover:underline">
            Abrir módulo →
          </span>
        </Link>
        <Link
          to="/admin/finanzas"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md sm:col-span-2 lg:col-span-1"
        >
          <p className="text-sm font-semibold text-slate-900">Finanzas</p>
          <p className="mt-2 text-sm text-slate-600">
            Ingresos por periodo y desempeño por tipo de servicio.
          </p>
          <span className="mt-4 inline-flex items-center text-sm font-semibold text-sky-700 group-hover:underline">
            Abrir módulo →
          </span>
        </Link>
      </div>
    </div>
  )
}
