import { Link } from 'react-router-dom'
import { useReservas } from '../../context/ReservasContext'
import { useAuth } from '../../context/AuthContext'
import { labelReservaEstado } from '../../lib/labels'

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

  const first = user?.name?.trim().split(/\s+/)[0] ?? user?.name

  return (
    <div className="relative space-y-8">
      <div
        className="pointer-events-none absolute right-0 top-0 -z-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-300/40 to-transparent blur-2xl animate-client-float-slow"
        aria-hidden
      />

      <header className="animate-client-fade-up">
        <p className="text-sm font-medium text-violet-700/90">
          Panel cliente · Car-Wash Cereté
        </p>
        <h1 className="cliente-heading-gradient mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          Hola, {first}
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-600">
          Agenda tu visita en segundos y revisa el historial cuando el lavadero
          registre tus servicios.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 animate-client-fade-up animate-client-delay-1">
        <Link
          to="/cliente/agendar"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 px-5 py-5 text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/35 active:translate-y-0"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/15" />
          <div className="relative flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 transition group-hover:scale-105">
              <IconSparkle className="h-6 w-6" />
            </span>
            <div className="text-left">
              <span className="block text-lg font-bold leading-tight">
                Agendar nuevo turno
              </span>
              <span className="mt-1 block text-sm font-normal text-violet-100">
                Elige fecha, hora y servicio
              </span>
            </div>
          </div>
          <span className="mt-4 inline-flex items-center text-sm font-semibold text-white/95">
            Continuar
            <svg
              className="ml-1 h-4 w-4 transition group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </Link>

        <Link
          to="/cliente/reservas"
          className="group rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-xl hover:shadow-violet-100/80 active:translate-y-0"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100 transition group-hover:bg-violet-100">
              <IconCalendar className="h-6 w-6" />
            </span>
            <div className="text-left">
              <span className="block text-lg font-bold leading-tight text-slate-900">
                Ver mis reservas
              </span>
              <span className="mt-1 block text-sm font-normal text-slate-600">
                Cancelar o reprogramar cuando quieras
              </span>
            </div>
          </div>
        </Link>
      </div>

      <section className="animate-client-fade-up animate-client-delay-2 overflow-hidden rounded-2xl border border-violet-100/80 bg-white/95 shadow-xl shadow-violet-100/40 backdrop-blur-sm">
        <div className="border-b border-violet-50 bg-gradient-to-r from-violet-50/80 to-transparent px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white shadow-md shadow-violet-500/30">
              <IconClock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">Próximas citas</h2>
              <p className="text-xs text-slate-500">
                Resumen de lo que tienes programado
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {proximas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-inner ring-1 ring-slate-100">
                <IconCar className="h-8 w-8 text-violet-400" />
              </div>
              <p className="font-medium text-slate-700">No tienes citas próximas</p>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                Agenda un turno y aparecerá aquí automáticamente.
              </p>
              <Link
                to="/cliente/agendar"
                className="mt-5 inline-flex items-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:bg-violet-700"
              >
                Agendar ahora
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {proximas.map((r, i) => (
                <li
                  key={r.id}
                  className="animate-client-fade-up flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition hover:border-violet-100 hover:bg-violet-50/40"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {new Date(r.fechaHora).toLocaleString('es-CO', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-slate-600">
                      Placa <span className="font-mono font-medium">{r.placa}</span>
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-violet-800 ring-1 ring-violet-100">
                    {labelReservaEstado(r.estado)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

function IconSparkle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l-.259 1.035a3.375 3.375 0 00-2.456 2.456L14.25 6l1.036.259a3.375 3.375 0 002.455 2.456L18 9.75z" />
    </svg>
  )
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconCar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0h3.375c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125zm9 0h3.375c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H11.625c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125zm-9-13.5h15.75m-15.75 0a3 3 0 013-3h12a3 3 0 013 3m-18 0v.375c0 .621.504 1.125 1.125 1.125h18.75c.621 0 1.125-.504 1.125-1.125V5.25M3 9.75h18.75m-18.75 0v.375c0 .621.504 1.125 1.125 1.125h18.75c.621 0 1.125-.504 1.125-1.125V9.75" />
    </svg>
  )
}
