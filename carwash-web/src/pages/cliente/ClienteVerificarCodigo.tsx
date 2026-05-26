import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function ClienteVerificarCodigo() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verificarCodigoOTP } = useAuth()

  const telefono = (location.state?.telefono as string) || ''
  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNombre, setShowNombre] = useState(false)

  if (!telefono) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-red-200 bg-red-50/90 p-6 text-center text-red-900">
          Error: Teléfono no encontrado. Intenta de nuevo.
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await verificarCodigoOTP(telefono, codigo, nombre || undefined)
    if (result.ok) {
      navigate('/cliente')
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
          Verifica tu código
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-600">
          Te llegó por WhatsApp a {telefono}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="animate-client-fade-up animate-client-delay-1 space-y-5 rounded-2xl border border-violet-100/90 bg-white/95 p-5 shadow-xl shadow-violet-100/50 backdrop-blur-sm sm:p-6"
      >
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Código (6 dígitos)</span>
          <input
            type="text"
            placeholder="000000"
            maxLength={6}
            required
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-center text-2xl font-bold letter-spacing-2 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          />
        </label>

        {!showNombre ? (
          <button
            type="button"
            onClick={() => setShowNombre(true)}
            className="text-sm font-medium text-violet-700 hover:text-violet-900"
          >
            ¿Primera vez? Ingresa tu nombre
          </button>
        ) : (
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Tu nombre</span>
            <input
              type="text"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
            />
          </label>
        )}

        {error ? (
          <p className="animate-client-fade-in rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-900 shadow-sm">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || codigo.length !== 6}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 active:translate-y-0 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Verificar y acceder'}
        </button>
      </form>

      <div className="text-center text-sm text-slate-500">
        <button
          type="button"
          onClick={() => navigate('/cliente/login-telefono')}
          className="font-semibold text-violet-700 hover:text-violet-900"
        >
          Cambiar número de teléfono
        </button>
      </div>
    </div>
  )
}
