import { useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useReservas } from '../../context/ReservasContext'
import { useServicios } from '../../context/ServiciosContext'
import { ClientePageHeader } from '../../components/cliente/ClientePageHeader'
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
    <div className="space-y-8">
      <ClientePageHeader
        title="Historial de servicios"
        subtitle="Servicios completados vinculados a las placas que usaste en tus reservas."
      />

      {placas.size === 0 ? (
        <p className="animate-client-fade-up animate-client-delay-1 rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 p-6 text-center text-sm text-slate-600">
          Agenda al menos un turno con una placa para ver aquí el historial
          vinculado.
        </p>
      ) : null}

      <ul className="space-y-3">
        {historial.map((s) => (
          <li
            key={s.id}
            className="animate-client-fade-up rounded-2xl border border-slate-100 bg-white/95 p-5 text-sm shadow-lg shadow-slate-200/35 transition hover:border-violet-100"
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
