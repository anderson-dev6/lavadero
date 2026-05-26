import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function ClienteLoginTelefono() {
  const navigate = useNavigate()
  const { loginTelefono } = useAuth()
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await loginTelefono(telefono)
    if (result.ok) {
      navigate('/cliente/verificar-codigo', { state: { telefono } })
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

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
          Ingresa por WhatsApp
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-600">
          Recibirás un código en tu teléfono para verificar tu identidad
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="animate-client-fade-up animate-client-delay-1 space-y-5 rounded-2xl border border-violet-100/90 bg-white/95 p-5 shadow-xl shadow-violet-100/50 backdrop-blur-sm sm:p-6"
      >
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Número de teléfono</span>
          <input
            type="tel"
            placeholder="+57 320 1234567"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          />
        </label>

        {error ? (
          <p className="animate-client-fade-in rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-900 shadow-sm">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 active:translate-y-0 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar código'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        ¿No tienes cuenta?{' '}
        <a href="/registro" className="font-semibold text-violet-700 hover:text-violet-900">
          Regístrate aquí
        </a>
      </p>
    </div>
  )
}
