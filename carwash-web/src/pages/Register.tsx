import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Register() {
  const { registerCliente } = useAuth()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const r = await registerCliente({
      nombre,
      telefono,
      correo,
      contrasena,
    })
    setLoading(false)
    if (!r.ok) {
      setError(r.message)
      return
    }
    navigate('/login', { replace: true, state: { registered: true } })
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
              <path d="M12 28c0-6 4-10 12-10s12 4 12 10v6H12v-6z" stroke="currentColor" strokeWidth="2" />
              <path d="M16 22l2-8h12l2 8M10 34h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">Crear cuenta</h1>
          <p className="mt-1 text-sm font-medium text-sky-100/90">Car-Wash Cereté · Clientes</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Completa tus datos para agendar visitas y consultar el historial de tus vehículos cuando
            el lavadero los vincule a tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-left text-sm">
            <span className="mb-1.5 block font-medium text-slate-300">Nombre completo</span>
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
              placeholder="Ej. María López"
              disabled={loading}
            />
          </label>
          <label className="block text-left text-sm">
            <span className="mb-1.5 block font-medium text-slate-300">Teléfono</span>
            <input
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
              placeholder="Ej. 300 123 4567"
              disabled={loading}
            />
          </label>
          <label className="block text-left text-sm">
            <span className="mb-1.5 block font-medium text-slate-300">Correo electrónico</span>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
              placeholder="nombre@ejemplo.com"
              disabled={loading}
            />
          </label>
          <label className="block text-left text-sm">
            <span className="mb-1.5 block font-medium text-slate-300">Contraseña</span>
            <input
              type="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
              minLength={6}
            />
          </label>
          {error ? (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-sm text-red-200" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-sky-900/30 transition hover:from-sky-400 hover:to-sky-500 disabled:opacity-55"
          >
            {loading ? 'Creando cuenta…' : 'Crear mi cuenta'}
          </button>
        </form>

        <p className="mt-6 border-t border-white/[0.06] pt-6 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-sky-400 underline decoration-sky-400/40 underline-offset-2 hover:text-sky-300"
          >
            Iniciar sesión
          </Link>
        </p>
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
