import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useServicios } from '../../context/ServiciosContext'
import { hoyISO } from '../../lib/dates'
import {
  labelEstadoServicio,
  labelServicio,
  labelVehiculo,
} from '../../lib/labels'
import type { PaymentMethod } from '../../types/carwash'

export function EmpleadoServicios() {
  const { user } = useAuth()
  const { servicios, actualizarEstado, marcarCompletado } = useServicios()
  const [metodo, setMetodo] = useState<PaymentMethod>('efectivo')
  const hoy = hoyISO()

  const mios = useMemo(() => {
    const n = user?.name ?? ''
    return servicios.filter(
      (s) =>
        s.fecha === hoy &&
        s.empleadoAsignado.toLowerCase() === n.toLowerCase(),
    )
  }, [servicios, user?.name, hoy])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Mis servicios hoy (RF-01)
        </h1>
        <p className="text-slate-600">
          Placa, tipo de servicio y marcar completado.
        </p>
      </div>

      <label className="block max-w-xs text-sm">
        <span className="font-medium text-slate-700">Método de pago al completar</span>
        <select
          value={metodo}
          onChange={(e) => setMetodo(e.target.value as PaymentMethod)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="nequi">Nequi</option>
          <option value="daviplata">Daviplata</option>
        </select>
      </label>

      <ul className="space-y-3">
        {mios.map((s) => (
          <li
            key={s.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-lg font-bold text-slate-900">{s.placa}</p>
            <p className="text-sm text-slate-600">
              {labelVehiculo(s.tipoVehiculo)} · {labelServicio(s.tipoServicio)}
            </p>
            <p className="text-sm text-slate-500">
              Entrada: {s.horaEntrada} ·{' '}
              <span className="font-medium text-slate-700">
                {labelEstadoServicio(s.estado)}
              </span>
            </p>
            <p className="text-sm font-medium text-sky-800">
              ${s.precio.toLocaleString('es-CO')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.estado === 'pendiente' ? (
                <button
                  type="button"
                  className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                  onClick={() =>
                    void actualizarEstado(s.id, 'en_proceso')
                  }
                >
                  Iniciar (en proceso)
                </button>
              ) : null}
              {s.estado === 'en_proceso' ? (
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                  onClick={() => void marcarCompletado(s.id, metodo)}
                >
                  Marcar completado
                </button>
              ) : null}
              {s.estado === 'completado' ? (
                <span className="text-sm text-emerald-700">
                  Listo {s.horaSalida ? `· salida ${s.horaSalida}` : ''}
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {mios.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No tienes servicios asignados para hoy. El administrador debe
          asignarte en el registro del servicio (mismo nombre:{' '}
          <strong>{user?.name}</strong>).
        </p>
      ) : null}
    </div>
  )
}
