import type { LavadoServicio, PaymentMethod, ProductoInventario, Reserva, ServiceStatus, ServiceType, VehicleType } from '../../types/carwash'

type ServicioRow = Record<string, unknown>
type ReservaRow = Record<string, unknown>
type ProductoRow = Record<string, unknown>

export function servicioFromRow(row: ServicioRow): LavadoServicio {
  const fecha =
    typeof row.fecha === 'string'
      ? row.fecha.slice(0, 10)
      : String(row.fecha).slice(0, 10)
  return {
    id: String(row.id),
    placa: String(row.placa),
    tipoVehiculo: row.tipo_vehiculo as VehicleType,
    tipoServicio: row.tipo_servicio as ServiceType,
    horaEntrada: String(row.hora_entrada),
    horaSalida: row.hora_salida != null ? String(row.hora_salida) : null,
    estado: row.estado as ServiceStatus,
    empleadoAsignado: String(row.empleado_asignado),
    precio: Number(row.precio),
    fecha,
    metodoPago: (row.metodo_pago as PaymentMethod | null) ?? undefined,
  }
}

export function reservaFromRow(row: ReservaRow): Reserva {
  const raw = String(row.fecha_hora)
  const fh = raw.includes('T') ? raw : raw.replace(' ', 'T')
  return {
    id: String(row.id),
    clienteEmail: String(row.cliente_email),
    clienteNombre: String(row.cliente_nombre),
    fechaHora: fh,
    tipoServicio: row.tipo_servicio as ServiceType,
    placa: String(row.placa),
    tipoVehiculo: row.tipo_vehiculo as VehicleType,
    estado: row.estado as Reserva['estado'],
  }
}

export function productoFromRow(row: ProductoRow): ProductoInventario {
  return {
    id: String(row.id),
    nombre: String(row.nombre),
    cantidadActual: Number(row.cantidad_actual),
    cantidadMinima: Number(row.cantidad_minima),
    unidad: String(row.unidad),
  }
}
