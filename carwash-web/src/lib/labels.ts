import type {
  PaymentMethod,
  ReservaEstado,
  ServiceStatus,
  ServiceType,
  VehicleType,
} from '../types/carwash'

export function labelVehiculo(t: VehicleType): string {
  const m: Record<VehicleType, string> = {
    carro: 'Carro',
    moto: 'Moto',
    camioneta: 'Camioneta',
  }
  return m[t]
}

export function labelServicio(t: ServiceType): string {
  const m: Record<ServiceType, string> = {
    basico: 'Básico',
    completo: 'Completo',
    detallado: 'Detallado',
    otro: 'Otro',
  }
  return m[t]
}

export function labelEstadoServicio(s: ServiceStatus): string {
  const m: Record<ServiceStatus, string> = {
    pendiente: 'Pendiente',
    en_proceso: 'En proceso',
    completado: 'Completado',
  }
  return m[s]
}

export function labelReservaEstado(e: ReservaEstado): string {
  const m: Record<ReservaEstado, string> = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    cancelada: 'Cancelada',
  }
  return m[e]
}

export function labelPago(m: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    nequi: 'Nequi',
    daviplata: 'Daviplata',
  }
  return map[m]
}
