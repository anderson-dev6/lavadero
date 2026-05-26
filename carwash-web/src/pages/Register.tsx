import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Register() {
  const navigate = useNavigate()
  const { loginTelefono, verificarCodigoOTP } = useAuth()
  const [nombre, setNombre] = useState('')
  const [codigoPais, setCodigoPais] = useState('+57')
  const [telefono, setTelefono] = useState('')
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [codigoEnviado, setCodigoEnviado] = useState(false)

  async function handleEnviarCodigo(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!nombre.trim() || !telefono.trim()) {
      setError('Nombre y teléfono son obligatorios')
      return
    }
    setLoading(true)
    const telefonoCompleto = codigoPais + telefono.trim().replace(/\D/g, '')
    const result = await loginTelefono(telefonoCompleto)
    if (result.ok) {
      setCodigoEnviado(true)
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  async function handleVerificar(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const telefonoCompleto = codigoPais + telefono.trim().replace(/\D/g, '')
    const result = await verificarCodigoOTP(telefonoCompleto, codigo.trim(), nombre.trim())
    if (result.ok) {
      navigate('/cliente')
    } else {
      setError(result.message)
    }
    setLoading(false)
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

        {!codigoEnviado ? (
          <form onSubmit={handleEnviarCodigo} className="mt-8 space-y-5">
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
              <div className="flex gap-2">
                <select
                  value={codigoPais}
                  onChange={(e) => setCodigoPais(e.target.value)}
                  disabled={loading}
                  className="rounded-xl border border-white/10 bg-[#161b22] px-2 py-3 text-[15px] text-white focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
                >
                  <option value="+57">+57</option>
                  <option value="+1">+1</option>
                  <option value="+34">+34</option>
                  <option value="+44">+44</option>
                  <option value="+33">+33</option>
                  <option value="+49">+49</option>
                  <option value="+39">+39</option>
                  <option value="+52">+52</option>
                  <option value="+55">+55</option>
                  <option value="+56">+56</option>
                </select>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
                  placeholder="Ej. 300 123 4567"
                  disabled={loading}
                />
              </div>
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
              {loading ? 'Enviando código…' : 'Crear mi cuenta'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerificar} className="mt-8 space-y-5">
            <div className="rounded-lg bg-sky-500/10 px-3 py-2 text-center text-sm text-sky-200">
              Código enviado a {codigoPais}{telefono}
            </div>
            <label className="block text-left text-sm">
              <span className="mb-1.5 block font-medium text-slate-300">Código (6 dígitos)</span>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-center text-2xl font-bold letter-spacing-2 text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
              />
            </label>
            {error ? (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-sm text-red-200" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading || codigo.length !== 6}
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-sky-900/30 transition hover:from-sky-400 hover:to-sky-500 disabled:opacity-55"
            >
              {loading ? 'Verificando…' : 'Verificar y entrar'}
            </button>
            <button
              type="button"
              onClick={() => setCodigoEnviado(false)}
              className="w-full rounded-xl border border-white/10 py-3.5 text-[15px] font-semibold text-sky-400 transition hover:border-sky-500/50"
            >
              Cambiar teléfono
            </button>
          </form>
        )}

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
