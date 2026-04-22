import { Link } from 'react-router-dom'
import { useReservas } from '../../context/ReservasContext'
import { useAuth } from '../../context/AuthContext'

export function ClienteInicio() {
  const { user } = useAuth()
  const { reservas } = useReservas()
  const email = user?.email?.toLowerCase() ?? ''
  const proximas = reservas
    .filter(
      (r) =>
        r.clienteEmail === email &&
        r.estado !== 'cancelada' &&
        new Date(r.fechaHora) >= new Date(new Date().setHours(0, 0, 0, 0)),
    )
    .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Hola, {user?.name}</h1>
        <p className="text-slate-600">
          Agenda tu visita y consulta el historial cuando el lavadero registre tus servicios.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          to="/cliente/agendar"
          className="rounded-xl bg-violet-600 px-4 py-3 text-center font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          Agendar nuevo turno
        </Link>
        <Link
          to="/cliente/reservas"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center font-medium text-slate-800 hover:bg-slate-50"
        >
          Ver mis reservas
        </Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-800">Próximas citas</h2>
        {proximas.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No tienes citas próximas.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {proximas.map((r) => (
              <li key={r.id} className="text-slate-700">
                {new Date(r.fechaHora).toLocaleString('es-CO')} · {r.placa} ·{' '}
                {r.estado}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
