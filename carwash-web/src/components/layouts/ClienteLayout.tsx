import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { rutaPorRol } from '../../lib/routes'

const links = [
  {
    to: '/cliente',
    end: true,
    label: 'Inicio',
    Icon: IconHome,
  },
  {
    to: '/cliente/agendar',
    label: 'Agendar',
    Icon: IconCalendar,
  },
  {
    to: '/cliente/reservas',
    label: 'Mis reservas',
    Icon: IconClipboard,
  },
  {
    to: '/cliente/historial',
    label: 'Historial',
    Icon: IconClock,
  },
]

function initials(name: string | undefined) {
  if (!name?.trim()) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function ClienteLayout() {
  const { user, logout } = useAuth()

  if (user && user.role !== 'cliente') {
    return <Navigate to={rutaPorRol(user.role)} replace />
  }

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-gradient-to-b from-slate-50 via-violet-50/40 to-slate-100 text-slate-900">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-40 h-64 w-64 rounded-full bg-indigo-400/15 blur-3xl"
        aria-hidden
      />

      <header className="relative border-b border-violet-100/80 bg-white/85 shadow-[0_1px_0_0_rgba(139,92,246,0.06)] backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 animate-client-fade-up">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-sm font-bold text-white shadow-lg shadow-violet-500/25 ring-2 ring-white">
              {initials(user?.name)}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">
                Cliente
              </p>
              <p className="font-semibold text-slate-900">{user?.name}</p>
              {user?.telefono ? (
                <p className="text-sm text-slate-500">{user.telefono}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end animate-client-fade-up animate-client-delay-1">
            <NavLink
              to="/"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-800"
            >
              Inicio web
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-900 active:scale-[0.98]"
            >
              Salir
            </button>
          </div>
        </div>

        <nav className="border-t border-violet-100/60 bg-gradient-to-r from-violet-50/90 via-white/70 to-indigo-50/80 backdrop-blur-sm">
          <ul className="mx-auto flex max-w-2xl flex-wrap gap-1.5 px-3 py-3 sm:gap-2">
            {links.map((item, i) => (
              <li key={item.to} className="flex-1 sm:flex-none">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'group flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 sm:justify-start sm:px-4',
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30'
                        : 'text-violet-950/75 hover:bg-white/90 hover:text-violet-900 hover:shadow-sm',
                    ].join(' ')
                  }
                  style={{
                    animation: `client-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both`,
                    animationDelay: `${120 + i * 45}ms`,
                  }}
                >
                  <item.Icon className="h-[18px] w-[18px] shrink-0 opacity-90 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="relative mx-auto max-w-2xl px-4 py-8 pb-16">
        <Outlet />
      </main>
    </div>
  )
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}

function IconClipboard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}
