import type { UserRole } from '../types/carwash'

export function rutaPorRol(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'empleado':
      return '/empleado'
    case 'cliente':
      return '/cliente'
    default:
      return '/'
  }
}
