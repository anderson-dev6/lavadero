export type VehicleType = 'carro' | 'moto' | 'camioneta'

export type ServiceType = 'basico' | 'completo' | 'detallado' | 'otro'

export type ServiceStatus = 'pendiente' | 'en_proceso' | 'completado'

export type PaymentMethod = 'efectivo' | 'transferencia' | 'nequi' | 'daviplata'

export type LavadoServicio = {
  id: string
  placa: string
  tipoVehiculo: VehicleType
  tipoServicio: ServiceType
  horaEntrada: string
  horaSalida: string | null
  estado: ServiceStatus
  empleadoAsignado: string
  precio: number
  fecha: string
  metodoPago?: PaymentMethod
}

export type ReservaEstado = 'pendiente' | 'confirmada' | 'cancelada'

export type Reserva = {
  id: string
  clienteEmail: string
  clienteNombre: string
  fechaHora: string
  tipoServicio: ServiceType
  placa: string
  tipoVehiculo: VehicleType
  estado: ReservaEstado
}

export type ProductoInventario = {
  id: string
  nombre: string
  cantidadActual: number
  cantidadMinima: number
  unidad: string
}

export type UserRole = 'admin' | 'empleado' | 'cliente'
