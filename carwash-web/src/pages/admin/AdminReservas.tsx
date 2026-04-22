import { useReservas } from '../../context/ReservasContext'
import { hoyISO } from '../../lib/dates'
import { labelReservaEstado, labelServicio, labelVehiculo } from '../../lib/labels'
import type { Reserva, ReservaEstado } from '../../types/carwash'

export function AdminReservas() {
  const { reservas, cambiarEstado } = useReservas()
  const hoy = hoyISO()

  const ordenadas = [...reservas].sort((a, b) =>
    a.fechaHora.localeCompare(b.fechaHora),
  )

  const delDia = ordenadas.filter((r) => r.fechaHora.startsWith(hoy))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Reservas (RF-02)
        </h1>
        <p className="text-slate-600">
          Confirmar o cancelar citas. Hoy: {hoy}
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Reservas del día
        </h2>
        <ListaReservas
          items={delDia}
          onCambiar={cambiarEstado}
          vacio="No hay reservas para hoy."
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Todas</h2>
        <ListaReservas
          items={ordenadas}
          onCambiar={cambiarEstado}
          vacio="Aún no hay reservas."
        />
      </section>
    </div>
  )
}

function ListaReservas({
  items,
  onCambiar,
  vacio,
}: {
  items: Reserva[]
  onCambiar: (id: string, e: ReservaEstado) => void | Promise<void>
  vacio: string
}) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-slate-500">{vacio}</p>
  }

  return (
    <ul className="mt-3 divide-y divide-slate-100">
      {items.map((r) => (
        <li
          key={r.id}
          className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium text-slate-800">
              {r.clienteNombre} · {r.placa}
            </p>
            <p className="text-sm text-slate-600">
              {new Date(r.fechaHora).toLocaleString('es-CO', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}{' '}
              · {labelServicio(r.tipoServicio)} ·{' '}
              {labelVehiculo(r.tipoVehiculo)}
            </p>
            <p className="text-xs text-slate-500">{r.clienteEmail}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                r.estado === 'confirmada'
                  ? 'bg-emerald-100 text-emerald-800'
                  : r.estado === 'cancelada'
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-amber-100 text-amber-900'
              }`}
            >
              {labelReservaEstado(r.estado)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {r.estado === 'pendiente' ? (
              <>
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                  onClick={() => void onCambiar(r.id, 'confirmada')}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => void onCambiar(r.id, 'cancelada')}
                >
                  Cancelar
                </button>
              </>
            ) : null}
            {r.estado === 'confirmada' ? (
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => void onCambiar(r.id, 'cancelada')}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
