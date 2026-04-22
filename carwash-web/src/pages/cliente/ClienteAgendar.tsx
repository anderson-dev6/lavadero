import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useReservas } from '../../context/ReservasContext'
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Agendar turno</h1>
        <p className="text-slate-600">
          Horarios según capacidad (3 vehículos por hora, 8:00–17:00).
        </p>
      </div>

      <form
        onSubmit={enviar}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Tipo de vehículo</span>
          <select
            value={tipoVehiculo}
            onChange={(e) =>
              setTipoVehiculo(e.target.value as VehicleType)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="basico">Básico</option>
            <option value="completo">Completo</option>
            <option value="detallado">Detallado</option>
            <option value="otro">Otro</option>
          </select>
        </label>

        {okMsg ? (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
            {okMsg}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-violet-600 py-2.5 font-semibold text-white hover:bg-violet-700"
        >
          Solicitar turno
        </button>
      </form>

      <Link to="/cliente/reservas" className="text-sm font-medium text-violet-700 underline">
        Ver mis reservas
      </Link>
    </div>
  )
}
