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
import { supabase } from '../lib/supabase/client'
import { reservaFromRow } from '../lib/supabase/mappers'
import type { Reserva, ReservaEstado, ServiceType, VehicleType } from '../types/carwash'

export type NuevaReservaInput = {
  clienteEmail: string
  clienteNombre: string
  fechaHora: string
  tipoServicio: ServiceType
  placa: string
  tipoVehiculo: VehicleType
}

type Ctx = {
  reservas: Reserva[]
  loading: boolean
  refresh: () => Promise<void>
  crear: (input: NuevaReservaInput) => Promise<Reserva | null>
  cambiarEstado: (id: string, estado: ReservaEstado) => Promise<void>
  reprogramar: (id: string, nuevaFechaHora: string) => Promise<void>
  delCliente: (email: string) => Reserva[]
}

const ReservasContext = createContext<Ctx | null>(null)

function toTimestamptz(fechaHora: string): string {
  if (fechaHora.includes('Z') || fechaHora.includes('+')) return fechaHora
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(fechaHora)) {
    return new Date(fechaHora).toISOString()
  }
  return fechaHora
}

export function ReservasProvider({ children }: { children: ReactNode }) {
  const { user, authReady } = useAuth()
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!user) {
      setReservas([])
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .order('fecha_hora', { ascending: false })

    setLoading(false)
    if (error) {
      console.error(error)
      return
    }
    setReservas((data ?? []).map((row) => reservaFromRow(row)))
  }, [user])

  useEffect(() => {
    if (!authReady) return
    void load()
  }, [authReady, user, load])

  const crear = useCallback(
    async (input: NuevaReservaInput) => {
      if (!user) return null
      const row = {
        cliente_email: input.clienteEmail.trim().toLowerCase(),
        cliente_nombre: input.clienteNombre.trim(),
        fecha_hora: toTimestamptz(input.fechaHora),
        tipo_servicio: input.tipoServicio,
        placa: input.placa.trim().toUpperCase(),
        tipo_vehiculo: input.tipoVehiculo,
        estado: 'pendiente' as const,
      }

      const { data, error } = await supabase
        .from('reservas')
        .insert(row)
        .select('*')
        .single()

      if (error) {
        console.error(error)
        return null
      }
      const mapped = reservaFromRow(data as Record<string, unknown>)
      setReservas((prev) => [mapped, ...prev])
      return mapped
    },
    [user],
  )

  const cambiarEstado = useCallback(
    async (id: string, estado: ReservaEstado) => {
      const { error } = await supabase.from('reservas').update({ estado }).eq('id', id)
      if (error) console.error(error)
      else await load()
    },
    [load],
  )

  const reprogramar = useCallback(
    async (id: string, nuevaFechaHora: string) => {
      const { error } = await supabase
        .from('reservas')
        .update({
          fecha_hora: toTimestamptz(nuevaFechaHora),
          estado: 'pendiente',
        })
        .eq('id', id)

      if (error) console.error(error)
      else await load()
    },
    [load],
  )

  const delCliente = useCallback((email: string) => {
    const e = email.trim().toLowerCase()
    return reservas.filter((r) => r.clienteEmail === e)
  }, [reservas])

  const value = useMemo(
    () => ({
      reservas,
      loading,
      refresh: load,
      crear,
      cambiarEstado,
      reprogramar,
      delCliente,
    }),
    [reservas, loading, load, crear, cambiarEstado, reprogramar, delCliente],
  )

  return (
    <ReservasContext.Provider value={value}>{children}</ReservasContext.Provider>
  )
}

export function useReservas() {
  const ctx = useContext(ReservasContext)
  if (!ctx) throw new Error('useReservas dentro de ReservasProvider')
  return ctx
}
