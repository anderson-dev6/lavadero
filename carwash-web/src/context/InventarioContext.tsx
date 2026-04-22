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
import { productoFromRow } from '../lib/supabase/mappers'
import type { ProductoInventario } from '../types/carwash'

type Ctx = {
  productos: ProductoInventario[]
  alertas: ProductoInventario[]
  loading: boolean
  refresh: () => Promise<void>
  actualizarCantidad: (id: string, cantidad: number) => Promise<void>
  agregarProducto: (p: Omit<ProductoInventario, 'id'>) => Promise<void>
}

const InventarioContext = createContext<Ctx | null>(null)

export function InventarioProvider({ children }: { children: ReactNode }) {
  const { user, authReady } = useAuth()
  const [productos, setProductos] = useState<ProductoInventario[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!user) {
      setProductos([])
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre')

    setLoading(false)
    if (error) {
      console.error(error)
      return
    }
    setProductos((data ?? []).map((row) => productoFromRow(row)))
  }, [user])

  useEffect(() => {
    if (!authReady) return
    void load()
  }, [authReady, user, load])

  const alertas = useMemo(
    () => productos.filter((p) => p.cantidadActual <= p.cantidadMinima),
    [productos],
  )

  const actualizarCantidad = useCallback(
    async (id: string, cantidad: number) => {
      const { error } = await supabase
        .from('productos')
        .update({
          cantidad_actual: Math.max(0, cantidad),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) console.error(error)
      else await load()
    },
    [load],
  )

  const agregarProducto = useCallback(
    async (p: Omit<ProductoInventario, 'id'>) => {
      const { error } = await supabase.from('productos').insert({
        nombre: p.nombre,
        cantidad_actual: p.cantidadActual,
        cantidad_minima: p.cantidadMinima,
        unidad: p.unidad,
      })

      if (error) console.error(error)
      else await load()
    },
    [load],
  )

  const value = useMemo(
    () => ({
      productos,
      alertas,
      loading,
      refresh: load,
      actualizarCantidad,
      agregarProducto,
    }),
    [productos, alertas, loading, load, actualizarCantidad, agregarProducto],
  )

  return (
    <InventarioContext.Provider value={value}>
      {children}
    </InventarioContext.Provider>
  )
}

export function useInventario() {
  const ctx = useContext(InventarioContext)
  if (!ctx) throw new Error('useInventario dentro de InventarioProvider')
  return ctx
}
