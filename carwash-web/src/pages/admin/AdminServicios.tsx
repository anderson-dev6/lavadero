import { useEffect, useMemo, useState } from 'react'
import { useServicios } from '../../context/ServiciosContext'
import { hoyISO } from '../../lib/dates'
import { nombresEmpleadosActivos } from '../../lib/empleadosApi'
import {
  labelEstadoServicio,
  labelServicio,
  labelVehiculo,
} from '../../lib/labels'
import type {
  ServiceStatus,
  ServiceType,
  VehicleType,
} from '../../types/carwash'

export function AdminServicios() {
  const { serviciosFiltrados, agregar, actualizarEstado, marcarCompletado } =
    useServicios()
  const [fecha, setFecha] = useState(hoyISO())
  const [estado, setEstado] = useState<ServiceStatus | 'todos'>('todos')
  const [empleado, setEmpleado] = useState('')
  const [tipoVeh, setTipoVeh] = useState<VehicleType | 'todos'>('todos')

  const lista = useMemo(
    () =>
      serviciosFiltrados({
        fecha,
        estado,
        empleado: empleado.trim() || undefined,
        tipoVehiculo: tipoVeh,
      }),
    [serviciosFiltrados, fecha, estado, empleado, tipoVeh],
  )

  const [placa, setPlaca] = useState('')
  const [tipoVehiculo, setTipoVehiculo] = useState<VehicleType>('carro')
  const [tipoServicio, setTipoServicio] = useState<ServiceType>('basico')
  const [empAsig, setEmpAsig] = useState('')
  const [precio, setPrecio] = useState(25000)
  const [empleadosOpts, setEmpleadosOpts] = useState<string[]>([])

  useEffect(() => {
    void nombresEmpleadosActivos().then(setEmpleadosOpts)
  }, [])

  async function handleNuevo(e: React.FormEvent) {
    e.preventDefault()
    const asignado = empAsig.trim() || empleadosOpts[0] || 'Empleado'
    await agregar({
      placa,
      tipoVehiculo,
      tipoServicio,
      empleadoAsignado: asignado,
      precio: Number(precio) || 0,
      fecha,
    })
    setPlaca('')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Servicios del día (RF-01)
        </h1>
        <p className="text-slate-600">
          Registro, filtros y estados guardados en Supabase.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Nuevo servicio
        </h2>
        <form
          onSubmit={handleNuevo}
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Placa</span>
            <input
              required
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="ABC123"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Tipo vehículo</span>
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
            <span className="font-medium text-slate-700">Tipo servicio</span>
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
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Empleado</span>
            <select
              value={empAsig || empleadosOpts[0] || ''}
              onChange={(e) => setEmpAsig(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {empleadosOpts.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Precio ($)</span>
            <input
              type="number"
              min={0}
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Fecha</span>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
            >
              Registrar servicio
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Filtros</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="text-sm">
            <span className="mr-2 font-medium text-slate-700">Fecha</span>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-1.5"
            />
          </label>
          <label className="text-sm">
            <span className="mr-2 font-medium text-slate-700">Estado</span>
            <select
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value as ServiceStatus | 'todos')
              }
              className="rounded-lg border border-slate-300 px-2 py-1.5"
            >
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En proceso</option>
              <option value="completado">Completado</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mr-2 font-medium text-slate-700">Empleado</span>
            <input
              placeholder="Nombre"
              value={empleado}
              onChange={(e) => setEmpleado(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-1.5"
            />
          </label>
          <label className="text-sm">
            <span className="mr-2 font-medium text-slate-700">Vehículo</span>
            <select
              value={tipoVeh}
              onChange={(e) =>
                setTipoVeh(e.target.value as VehicleType | 'todos')
              }
              className="rounded-lg border border-slate-300 px-2 py-1.5"
            >
              <option value="todos">Todos</option>
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
              <option value="camioneta">Camioneta</option>
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-2 pr-2">Placa</th>
                <th className="py-2 pr-2">Vehículo</th>
                <th className="py-2 pr-2">Servicio</th>
                <th className="py-2 pr-2">Entrada</th>
                <th className="py-2 pr-2">Estado</th>
                <th className="py-2 pr-2">Empleado</th>
                <th className="py-2 pr-2">Precio</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((s) => (
                <tr key={s.id} className="border-b border-slate-100">
                  <td className="py-2 pr-2 font-medium">{s.placa}</td>
                  <td className="py-2 pr-2">{labelVehiculo(s.tipoVehiculo)}</td>
                  <td className="py-2 pr-2">{labelServicio(s.tipoServicio)}</td>
                  <td className="py-2 pr-2">{s.horaEntrada}</td>
                  <td className="py-2 pr-2">{labelEstadoServicio(s.estado)}</td>
                  <td className="py-2 pr-2">{s.empleadoAsignado}</td>
                  <td className="py-2 pr-2">
                    ${s.precio.toLocaleString('es-CO')}
                  </td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-1">
                      {s.estado === 'pendiente' ? (
                        <button
                          type="button"
                          className="rounded bg-slate-200 px-2 py-1 text-xs font-medium hover:bg-slate-300"
                          onClick={() =>
                            void actualizarEstado(s.id, 'en_proceso')
                          }
                        >
                          En proceso
                        </button>
                      ) : null}
                      {s.estado === 'en_proceso' ? (
                        <button
                          type="button"
                          className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                          onClick={() =>
                            void marcarCompletado(s.id, 'efectivo')
                          }
                        >
                          Completar
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 ? (
            <p className="py-6 text-center text-slate-500">
              No hay servicios con estos filtros.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
