import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { horaActual } from '../lib/dates'
import { supabase } from '../lib/supabase/client'
import { servicioFromRow } from '../lib/supabase/mappers'
import type {
  LavadoServicio,
  PaymentMethod,
  ServiceStatus,
  ServiceType,
  VehicleType,
} from '../types/carwash'

export type NuevoServicioInput = {
  placa: string
  tipoVehiculo: VehicleType
  tipoServicio: ServiceType
  empleadoAsignado: string
  precio: number
  fecha: string
  horaEntrada?: string
}

type Ctx = {
  servicios: LavadoServicio[]
  loading: boolean
  refresh: () => Promise<void>
  agregar: (input: NuevoServicioInput) => Promise<LavadoServicio | null>
  actualizarEstado: (id: string, estado: ServiceStatus) => Promise<void>
  marcarCompletado: (id: string, metodoPago?: PaymentMethod) => Promise<void>
  serviciosFiltrados: (opts: {
    fecha?: string
    estado?: ServiceStatus | 'todos'
    empleado?: string
    tipoVehiculo?: VehicleType | 'todos'
  }) => LavadoServicio[]
}

const ServiciosContext = createContext<Ctx | null>(null)

export function ServiciosProvider({ children }: { children: ReactNode }) {
  const { user, authReady } = useAuth()
  const [servicios, setServicios] = useState<LavadoServicio[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!user) {
      setServicios([])
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .order('created_at', { ascending: false })

    setLoading(false)
    if (error) {
      console.error(error)
      return
    }
    setServicios((data ?? []).map((row) => servicioFromRow(row)))
  }, [user])

  useEffect(() => {
    if (!authReady) return
    void load()
  }, [authReady, user, load])

  const agregar = useCallback(
    async (input: NuevoServicioInput) => {
      if (!user) return null
      const row = {
        placa: input.placa.trim().toUpperCase(),
        tipo_vehiculo: input.tipoVehiculo,
        tipo_servicio: input.tipoServicio,
        hora_entrada: input.horaEntrada ?? horaActual(),
        hora_salida: null as string | null,
        estado: 'pendiente' as const,
        empleado_asignado: input.empleadoAsignado.trim(),
        precio: input.precio,
        fecha: input.fecha,
        metodo_pago: null as string | null,
      }

      const { data, error } = await supabase
        .from('servicios')
        .insert(row)
        .select('*')
        .single()

      if (error) {
        console.error(error)
        return null
      }
      const mapped = servicioFromRow(data as Record<string, unknown>)
      setServicios((prev) => [mapped, ...prev])
      return mapped
    },
    [user],
  )

  const actualizarEstado = useCallback(
    async (id: string, estado: ServiceStatus) => {
      const { error } = await supabase
        .from('servicios')
        .update({ estado })
        .eq('id', id)

      if (error) console.error(error)
      else await load()
    },
    [load],
  )

  const marcarCompletado = useCallback(
    async (id: string, metodoPago?: PaymentMethod) => {
      const { error } = await supabase
        .from('servicios')
        .update({
          estado: 'completado',
          hora_salida: horaActual(),
          metodo_pago: metodoPago ?? 'efectivo',
        })
        .eq('id', id)

      if (error) console.error(error)
      else await load()
    },
    [load],
  )

  const serviciosFiltrados = useCallback(
    (opts: {
      fecha?: string
      estado?: ServiceStatus | 'todos'
      empleado?: string
      tipoVehiculo?: VehicleType | 'todos'
    }) => {
      return servicios.filter((s) => {
        if (opts.fecha && s.fecha !== opts.fecha) return false
        if (opts.estado && opts.estado !== 'todos' && s.estado !== opts.estado)
          return false
        if (
          opts.empleado &&
          s.empleadoAsignado.toLowerCase() !== opts.empleado.toLowerCase()
        )
          return false
        if (
          opts.tipoVehiculo &&
          opts.tipoVehiculo !== 'todos' &&
          s.tipoVehiculo !== opts.tipoVehiculo
        )
          return false
        return true
      })
    },
    [servicios],
  )

  const value = useMemo(
    () => ({
      servicios,
      loading,
      refresh: load,
      agregar,
      actualizarEstado,
      marcarCompletado,
      serviciosFiltrados,
    }),
    [
      servicios,
      loading,
      load,
      agregar,
      actualizarEstado,
      marcarCompletado,
      serviciosFiltrados,
    ],
  )

  return (
    <ServiciosContext.Provider value={value}>
      {children}
    </ServiciosContext.Provider>
  )
}

export function useServicios() {
  const ctx = useContext(ServiciosContext)
  if (!ctx) throw new Error('useServicios dentro de ServiciosProvider')
  return ctx
}
