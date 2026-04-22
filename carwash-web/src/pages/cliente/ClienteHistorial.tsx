import { useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useReservas } from '../../context/ReservasContext'
import { useServicios } from '../../context/ServiciosContext'
import { labelServicio, labelVehiculo } from '../../lib/labels'

export function ClienteHistorial() {
  const { user } = useAuth()
  const { reservas } = useReservas()
  const { servicios } = useServicios()
  const email = user?.email?.toLowerCase() ?? ''

  const placas = useMemo(() => {
    const set = new Set<string>()
    for (const r of reservas) {
      if (r.clienteEmail === email) set.add(r.placa)
    }
    return set
  }, [reservas, email])

  const historial = useMemo(() => {
    return servicios
      .filter(
        (s) =>
          s.estado === 'completado' &&
          placas.size > 0 &&
          placas.has(s.placa),
      )
      .sort((a, b) => `${b.fecha} ${b.horaSalida ?? ''}`.localeCompare(`${a.fecha} ${a.horaSalida ?? ''}`))
  }, [servicios, placas])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Historial de servicios
        </h1>
        <p className="text-slate-600">
          Servicios completados asociados a las placas que usaste en tus reservas
          (RF-04).
        </p>
      </div>

      {placas.size === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Agenda al menos un turno con una placa para ver aquí el historial
          vinculado.
        </p>
      ) : null}

      <ul className="space-y-2">
        {historial.map((s) => (
          <li
            key={s.id}
            className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm"
          >
            <p className="font-semibold text-slate-900">
              {s.placa} · {s.fecha}
            </p>
            <p className="text-slate-600">
              {labelVehiculo(s.tipoVehiculo)} · {labelServicio(s.tipoServicio)}
            </p>
            <p className="text-slate-500">
              ${s.precio.toLocaleString('es-CO')}
              {s.horaSalida ? ` · salida ${s.horaSalida}` : ''}
            </p>
          </li>
        ))}
      </ul>

      {placas.size > 0 && historial.length === 0 ? (
        <p className="text-slate-500">
          Aún no hay servicios completados registrados para tus placas.
        </p>
      ) : null}
    </div>
  )
}
