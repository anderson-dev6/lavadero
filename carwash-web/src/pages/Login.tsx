import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { rutaPorRol } from '../lib/routes'
import { supabase } from '../lib/supabase/client'

export function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from
    ?.pathname
  const registered = (location.state as { registered?: boolean })?.registered

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendOk, setResendOk] = useState<string | null>(null)

  useEffect(() => {
    if (user) navigate(from || rutaPorRol(user.role), { replace: true })
  }, [user, from, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNeedsConfirm(false)
    setResendOk(null)
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (!result.ok) {
      setError(result.message)
      setNeedsConfirm(Boolean(result.needsEmailConfirmation))
      return
    }
  }

  async function reenviarConfirmacion() {
    const em = email.trim()
    if (!em) {
      setError('Escribe tu correo arriba para reenviar la confirmación.')
      return
    }
    setResendLoading(true)
    setResendOk(null)
    const { error: err } = await supabase.auth.resend({
      type: 'signup',
      email: em,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    setResendLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setResendOk(
      'Listo: revisa tu correo (y spam) y pulsa el enlace para activar la cuenta.',
    )
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#0f1419] px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.12),transparent)]"
        aria-hidden
      />

      <div className="relative w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-[#161b22]/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg shadow-sky-900/40"
            aria-hidden
          >
            <svg viewBox="0 0 48 48" width="30" height="30" fill="none" className="text-white">
              <path
                d="M12 28c0-6 4-10 12-10s12 4 12 10v6H12v-6z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 22l2-8h12l2 8M10 34h28"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm font-medium text-sky-100/90">Car-Wash Cereté</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Introduce el correo y la contraseña que usa tu cuenta. Serás dirigido a
            tu espacio de trabajo automáticamente.
          </p>
        </div>

        {registered ? (
          <div
            className="mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-100"
            role="status"
          >
            Cuenta creada. Si no entras al primer intento, puede que falte
            <strong className="font-semibold text-emerald-50"> confirmar el correo</strong>: mira tu
            bandeja (y spam) y abre el enlace de verificación antes de iniciar sesión.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <label className="block text-left text-sm">
            <span className="mb-1.5 block font-medium text-slate-300">Correo electrónico</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com"
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
            />
          </label>
          <label className="block text-left text-sm">
            <span className="mb-1.5 block font-medium text-slate-300">Contraseña</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
            />
          </label>
          {error ? (
            <div
              className="rounded-lg bg-red-500/10 px-3 py-3 text-left text-sm leading-relaxed text-red-100"
              role="alert"
            >
              {error}
            </div>
          ) : null}
          {needsConfirm ? (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => void reenviarConfirmacion()}
                disabled={resendLoading}
                className="w-full rounded-xl border border-sky-500/40 bg-sky-500/15 py-2.5 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/25 disabled:opacity-50"
              >
                {resendLoading ? 'Enviando…' : 'Reenviar correo de confirmación'}
              </button>
              {resendOk ? (
                <p className="text-center text-sm text-emerald-300/95" role="status">
                  {resendOk}
                </p>
              ) : null}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-sky-900/30 transition hover:from-sky-400 hover:to-sky-500 disabled:opacity-55"
          >
            {loading ? 'Accediendo…' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-6 space-y-4 border-t border-white/[0.06] pt-6 text-center">
          <Link
            to="/recuperar"
            className="text-sm font-medium text-sky-400 transition hover:text-sky-300"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <p className="text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link
              to="/registro"
              className="font-semibold text-sky-400 underline decoration-sky-400/40 underline-offset-2 hover:text-sky-300"
            >
              Registrarse
            </Link>
          </p>
        </div>
      </div>

      <Link
        to="/"
        className="relative mt-10 text-sm font-medium text-slate-500 transition hover:text-slate-300"
      >
        ← Volver al inicio
      </Link>
    </div>
  )
}
