import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase/client'

export function RecuperarContrasena() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(null)
    setErr(null)
    if (!email.trim()) {
      setErr('Indica tu correo electrónico.')
      return
    }
    setLoading(true)
    const redirect = `${window.location.origin}/login`
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirect,
    })
    setLoading(false)
    if (error) {
      setErr(error.message)
      return
    }
    setMsg(
      'Si existe una cuenta con ese correo, enviaremos instrucciones para restablecer la contraseña. Revisa también la carpeta de spam.',
    )
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#0f1419] px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.12),transparent)]"
        aria-hidden
      />

      <div className="relative w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-[#161b22]/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Recuperar contraseña
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Introduce el correo asociado a tu cuenta. Te enviaremos un enlace para
            elegir una nueva contraseña de forma segura.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-left text-sm">
            <span className="mb-1.5 block font-medium text-slate-300">
              Correo electrónico
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
              placeholder="nombre@ejemplo.com"
              disabled={loading}
            />
          </label>
          {err ? (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-sm text-red-200" role="alert">
              {err}
            </p>
          ) : null}
          {msg ? (
            <p className="rounded-lg bg-emerald-500/10 px-3 py-3 text-center text-sm text-emerald-100" role="status">
              {msg}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-sky-900/30 transition hover:from-sky-400 hover:to-sky-500 disabled:opacity-55"
          >
            {loading ? 'Enviando…' : 'Enviar enlace'}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-6 inline-flex w-full justify-center text-sm font-semibold text-sky-400 transition hover:text-sky-300"
        >
          Volver al inicio de sesión
        </Link>
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
