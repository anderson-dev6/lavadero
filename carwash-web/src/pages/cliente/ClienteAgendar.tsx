import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useReservas } from '../../context/ReservasContext'
import { ClientePageHeader } from '../../components/cliente/ClientePageHeader'
import { hoyISO } from '../../lib/dates'
import { horasDisponiblesParaFecha } from '../../lib/agendaSlots'
import type { ServiceType, VehicleType } from '../../types/carwash'

export function ClienteAgendar() {
  const { user } = useAuth()
  const { reservas, crear } = useReservas()
  const [fecha, setFecha] = useState(hoyISO())
  const [hora, setHora] = useState<number | ''>('')
  const [placa, setPlaca] = useState('')
  const [tipoVehiculo, setTipoVehiculo] = useState<VehicleType>('carro')
  const [tipoServicio, setTipoServicio] = useState<ServiceType>('basico')
  const [okMsg, setOkMsg] = useState<string | null>(null)

  const horasLibres = useMemo(
    () => horasDisponiblesParaFecha(reservas, fecha),
    [reservas, fecha],
  )

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setOkMsg(null)
    if (!user) return
    if (hora === '') {
      return
    }
    const fechaHora = `${fecha}T${String(hora).padStart(2, '0')}:00`
    const r = await crear({
      clienteEmail: user.email,
      clienteNombre: user.name,
      fechaHora,
      tipoServicio,
      placa,
      tipoVehiculo,
    })
    if (!r) {
      setOkMsg('No se pudo guardar la reserva. Revisa la consola o tu sesión.')
      return
    }
    setOkMsg(
      'Tu solicitud quedó registrada como pendiente. El lavadero la confirmará pronto.',
    )
    setPlaca('')
    setHora('')
  }

  return (
    <div className="space-y-8">
      <ClientePageHeader
        title="Agendar turno"
        subtitle="Horarios según capacidad: hasta 3 vehículos por hora, franja 8:00–17:00."
      />

      <form
        onSubmit={enviar}
        className="animate-client-fade-up animate-client-delay-1 space-y-5 rounded-2xl border border-violet-100/90 bg-white/95 p-5 shadow-xl shadow-violet-100/50 backdrop-blur-sm sm:p-6"
      >
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Fecha</span>
          <input
            type="date"
            required
            min={hoyISO()}
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value)
              setHora('')
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Hora disponible</span>
          <select
            required
            value={hora === '' ? '' : String(hora)}
            onChange={(e) =>
              setHora(e.target.value ? Number(e.target.value) : '')
            }
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          >
            <option value="">Elige hora</option>
            {horasLibres.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </label>
        {horasLibres.length === 0 ? (
          <p className="text-sm text-amber-800">
            No hay cupos ese día. Prueba otra fecha.
          </p>
        ) : null}

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Placa</span>
          <input
            required
            value={placa}
            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Tipo de vehículo</span>
          <select
            value={tipoVehiculo}
            onChange={(e) =>
              setTipoVehiculo(e.target.value as VehicleType)
            }
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          >
            <option value="carro">Carro</option>
            <option value="moto">Moto</option>
            <option value="camioneta">Camioneta</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Tipo de servicio</span>
          <select
            value={tipoServicio}
            onChange={(e) =>
              setTipoServicio(e.target.value as ServiceType)
            }
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          >
            <option value="basico">Básico</option>
            <option value="completo">Completo</option>
            <option value="detallado">Detallado</option>
            <option value="otro">Otro</option>
          </select>
        </label>

        {okMsg ? (
          <p className="animate-client-fade-in rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-900 shadow-sm">
            {okMsg}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 active:translate-y-0"
        >
          Solicitar turno
        </button>
      </form>

      <Link
        to="/cliente/reservas"
        className="animate-client-fade-up animate-client-delay-2 inline-flex items-center text-sm font-semibold text-violet-700 transition hover:text-violet-900"
      >
        Ver mis reservas
        <span aria-hidden className="ml-1">
          →
        </span>
      </Link>
    </div>
  )
}
