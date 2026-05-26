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

        <section className="border-t border-slate-200/80 bg-[#fafbfc] py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700/90">
                Nuestros servicios
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Elige el lavado perfecto para tu vehículo
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Tres niveles de servicio pensados para diferentes necesidades y presupuestos.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
                <span className="rounded-full bg-sky-100 px-3 py-1.5 text-sky-800">🚗 Carros</span>
                <span className="rounded-full bg-sky-100 px-3 py-1.5 text-sky-800">🏍️ Motos</span>
                <span className="rounded-full bg-sky-100 px-3 py-1.5 text-sky-800">🚙 Camionetas</span>
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M3 6h18M3 18h12" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Básico</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Lavado externo rápido. Ideal para mantener tu vehículo limpio en el día a día.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Lavado de carrocería
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Llantas y rines
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Secado completo
                  </li>
                </ul>
              </div>

              <div className="relative rounded-2xl border-2 border-sky-500 bg-white p-6 shadow-md">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white">
                  Más popular
                </span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-white">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Completo</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Lavado externo e interno. Tu vehículo queda impecable por dentro y por fuera.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Todo lo del Básico
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Aspirado interior
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Limpieza de tablero
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Vidrios por dentro
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Detallado</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Servicio premium. Cera, brillo y atención a cada detalle de tu vehículo.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Todo lo del Completo
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Cera y brillo
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Tratamiento de cuero
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600">✓</span> Motor (a petición)
                  </li>
                </ul>
              </div>
            </div>
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
