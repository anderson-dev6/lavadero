import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useReservas } from '../../context/ReservasContext'
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Mis reservas</h1>
        <p className="text-slate-600">Cancelar o reprogramar (RF-02).</p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-800">Reprogramar (elegir nueva franja)</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="date"
            min={hoyISO()}
            value={fechaRep}
            onChange={(e) => {
              setFechaRep(e.target.value)
              setHoraRep('')
            }}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
          <select
            value={horaRep === '' ? '' : String(horaRep)}
            onChange={(e) =>
              setHoraRep(e.target.value ? Number(e.target.value) : '')
            }
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
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

      <ul className="space-y-3">
        {mias
          .sort((a, b) => b.fechaHora.localeCompare(a.fechaHora))
          .map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
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
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => void aplicarReprogramar(r.id)}
                      disabled={horaRep === ''}
                      className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
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
