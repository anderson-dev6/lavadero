import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useReservas } from '../../context/ReservasContext'
import { ClientePageHeader } from '../../components/cliente/ClientePageHeader'
import { hoyISO } from '../../lib/dates'
import { horasDisponiblesParaFecha } from '../../lib/agendaSlots'
import { labelReservaEstado, labelServicio, labelVehiculo } from '../../lib/labels'

export function ClienteReservas() {
  const { user } = useAuth()
  const { reservas, cambiarEstado, reprogramar } = useReservas()
  const email = user?.email?.toLowerCase() ?? ''
  const mias = reservas.filter((r) => r.clienteEmail === email)
  const [fechaRep, setFechaRep] = useState(hoyISO())
  const [horaRep, setHoraRep] = useState<number | ''>('')

  const horasLibres = horasDisponiblesParaFecha(reservas, fechaRep)

  function cancelar(id: string) {
    if (confirm('¿Cancelar esta reserva?')) cambiarEstado(id, 'cancelada')
  }

  function aplicarReprogramar(id: string) {
    if (horaRep === '') return
    const nueva = `${fechaRep}T${String(horaRep).padStart(2, '0')}:00`
    reprogramar(id, nueva)
    setHoraRep('')
  }

  return (
    <div className="space-y-8">
      <ClientePageHeader
        title="Mis reservas"
        subtitle="Consulta el estado, cancela o reprograma cuando lo necesites."
      />

      <section className="animate-client-fade-up animate-client-delay-1 rounded-2xl border border-violet-100/90 bg-white/95 p-5 shadow-xl shadow-violet-100/40 backdrop-blur-sm">
        <h2 className="font-bold text-slate-900">Reprogramar</h2>
        <p className="mt-0.5 text-sm text-slate-500">Elige nueva fecha y hora disponibles.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="date"
            min={hoyISO()}
            value={fechaRep}
            onChange={(e) => {
              setFechaRep(e.target.value)
              setHoraRep('')
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          />
          <select
            value={horaRep === '' ? '' : String(horaRep)}
            onChange={(e) =>
              setHoraRep(e.target.value ? Number(e.target.value) : '')
            }
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          >
            <option value="">Hora</option>
            {horasLibres.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Elige fecha/hora y luego pulsa “Aplicar” en la reserva que quieras mover.
        </p>
      </section>

      <ul className="space-y-4">
        {mias
          .sort((a, b) => b.fechaHora.localeCompare(a.fechaHora))
          .map((r) => (
            <li
              key={r.id}
              className="animate-client-fade-up rounded-2xl border border-slate-100 bg-white/95 p-5 shadow-lg shadow-slate-200/40 transition hover:border-violet-100 hover:shadow-violet-100/50"
            >
              <p className="font-medium text-slate-900">
                {new Date(r.fechaHora).toLocaleString('es-CO')}
              </p>
              <p className="text-sm text-slate-600">
                {r.placa} · {labelVehiculo(r.tipoVehiculo)} ·{' '}
                {labelServicio(r.tipoServicio)}
              </p>
              <p className="text-sm text-slate-500">
                {labelReservaEstado(r.estado)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.estado !== 'cancelada' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void cancelar(r.id)}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100 active:scale-[0.98]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => void aplicarReprogramar(r.id)}
                      disabled={horaRep === ''}
                      className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Aplicar reprogramación
                    </button>
                  </>
                ) : null}
              </div>
            </li>
          ))}
      </ul>

      {mias.length === 0 ? (
        <p className="text-center text-slate-500">No tienes reservas aún.</p>
      ) : null}
    </div>
  )
}
