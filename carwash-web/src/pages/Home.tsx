import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { rutaPorRol } from '../lib/routes'

export function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-svh bg-[#fafbfc] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 shadow-sm shadow-sky-500/20"
              aria-hidden
            >
              <svg viewBox="0 0 48 48" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 28c0-6 4-10 12-10s12 4 12 10v6H12v-6z" />
                <path d="M16 22l2-8h12l2 8M10 34h28" strokeLinecap="round" />
              </svg>
            </span>
            <div className="text-left leading-tight">
              <span className="block text-[15px] font-semibold tracking-tight text-slate-900">
                Car-Wash Cereté
              </span>
              <span className="text-xs font-medium text-slate-500">
                Cereté, Córdoba
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            {!user ? (
              <>
                <Link
                  to="/registro"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Crear cuenta
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  Iniciar sesión
                </Link>
              </>
            ) : (
              <Link
                to={rutaPorRol(user.role)}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
              >
                Ir al panel
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-3xl px-5 pb-16 pt-14 text-center sm:px-8 sm:pt-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700/90">
            Gestión del lavadero
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl sm:leading-[1.15]">
            Tu lavadero, organizado y al día
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Controla servicios, turnos, ingresos e inventario desde un solo lugar.
            Pensado para el equipo del Car-Wash y para quienes reservan su visita.
          </p>

          {!user ? (
            <p className="mx-auto mt-10 max-w-md rounded-full border border-slate-200/80 bg-white px-5 py-3 text-sm text-slate-600 shadow-sm">
              Para continuar, usa{' '}
              <span className="font-semibold text-slate-800">Iniciar sesión</span>{' '}
              arriba. ¿Primera vez? Elige{' '}
              <Link to="/registro" className="font-semibold text-sky-700 underline decoration-sky-700/30 underline-offset-2 hover:text-sky-800">
                Crear cuenta
              </Link>
              .
            </p>
          ) : null}
        </section>

        <section className="border-t border-slate-200/80 bg-white py-14">
          <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:grid-cols-3 sm:px-8">
            {[
              {
                t: 'Operación diaria',
                d: 'Seguimiento de vehículos, servicios y turnos sin perder el hilo.',
              },
              {
                t: 'Reservas',
                d: 'Los clientes coordinan su visita; el equipo ve la agenda clara.',
              },
              {
                t: 'Visión del negocio',
                d: 'Ingresos e inventario visibles para decidir con tranquilidad.',
              },
            ].map((item) => (
              <div
                key={item.t}
                className="rounded-2xl border border-slate-100 bg-[#fafbfc] px-5 py-6 text-left shadow-sm"
              >
                <h2 className="text-sm font-semibold text-slate-900">{item.t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-8 text-center">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Car-Wash Cereté · Cereté, Córdoba
        </p>
      </footer>
    </div>
  )
}
