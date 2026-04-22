import type { User as SupabaseUser } from '@supabase/supabase-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '../lib/supabase/client'
import { esCorreoNoConfirmado, mensajeErrorLogin } from '../lib/supabase/authMessages'
import type { UserRole } from '../types/carwash'

export type User = {
  id: string
  email: string
  name: string
  role: UserRole
  telefono?: string
}

type RegistroClienteInput = {
  nombre: string
  telefono: string
  correo: string
  contrasena: string
}

type AuthState = {
  user: User | null
  authReady: boolean
  /** Vuelve a leer `profiles` en Supabase (útil si cambiaste el rol en la base). */
  refreshUser: () => Promise<void>
  login: (
    email: string,
    password: string,
  ) => Promise<
    | { ok: true }
    | { ok: false; message: string; needsEmailConfirmation?: boolean }
  >
  registerCliente: (
    data: RegistroClienteInput,
  ) => Promise<{ ok: true } | { ok: false; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

async function fetchProfileRow(
  userId: string,
): Promise<{ nombre: string; telefono: string | null; role: string } | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('nombre, telefono, role')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  if (!data || typeof data !== 'object') return null
  const row = data as {
    nombre: string
    telefono: string | null
    role: string
  }
  return row
}

async function ensureProfile(
  authUser: SupabaseUser,
): Promise<{ nombre: string; telefono: string | null; role: string }> {
  const existing = await fetchProfileRow(authUser.id)
  if (existing)
    return {
      nombre: existing.nombre,
      telefono: existing.telefono,
      role: existing.role,
    }

  const meta = authUser.user_metadata as Record<string, unknown> | undefined
  const nombre =
    (typeof meta?.nombre === 'string' && meta.nombre) ||
    authUser.email?.split('@')[0] ||
    'Usuario'
  const telefono =
    typeof meta?.telefono === 'string' ? meta.telefono : null
  const role =
    typeof meta?.role === 'string' ? meta.role : 'cliente'

  const { error } = await supabase.from('profiles').insert({
    id: authUser.id,
    nombre,
    telefono,
    role,
  })

  if (error) throw error
  return { nombre, telefono, role }
}

function mapUser(authUser: SupabaseUser, row: { nombre: string; telefono: string | null; role: string }): User {
  const role = row.role as UserRole
  return {
    id: authUser.id,
    email: authUser.email ?? '',
    name: row.nombre,
    telefono: row.telefono ?? undefined,
    role,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)

  const hydrate = useCallback(async (authUser: SupabaseUser | null) => {
    if (!authUser) {
      setUser(null)
      return
    }
    try {
      const row = await ensureProfile(authUser)
      setUser(mapUser(authUser, row))
    } catch (e) {
      console.error(e)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      void hydrate(session?.user ?? null).finally(() => {
        if (!cancelled) setAuthReady(true)
      })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void hydrate(session?.user ?? null)
      setAuthReady(true)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [hydrate])

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password) {
      return { ok: false as const, message: 'Completa correo y contraseña.' }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) {
      const raw = error.message || ''
      return {
        ok: false as const,
        message: mensajeErrorLogin(raw),
        needsEmailConfirmation: esCorreoNoConfirmado(raw),
      }
    }
    if (data.user) await hydrate(data.user)
    return { ok: true as const }
  }, [hydrate])

  const registerCliente = useCallback(
    async (data: RegistroClienteInput) => {
      const email = data.correo.trim().toLowerCase()
      if (!data.nombre.trim() || !data.telefono.trim() || !email) {
        return {
          ok: false as const,
          message: 'Nombre, teléfono y correo son obligatorios.',
        }
      }
      if (data.contrasena.length < 6) {
        return {
          ok: false as const,
          message: 'La contraseña debe tener al menos 6 caracteres.',
        }
      }

      const { error } = await supabase.auth.signUp({
        email,
        password: data.contrasena,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nombre: data.nombre.trim(),
            telefono: data.telefono.trim(),
            role: 'cliente',
          },
        },
      })

      if (error) {
        return {
          ok: false as const,
          message: error.message || 'No se pudo registrar.',
        }
      }

      return { ok: true as const }
    },
    [],
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    await hydrate(session?.user ?? null)
  }, [hydrate])

  useEffect(() => {
    function syncProfile() {
      void refreshUser()
    }
    window.addEventListener('focus', syncProfile)
    const onVis = () => {
      if (document.visibilityState === 'visible') syncProfile()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('focus', syncProfile)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [refreshUser])

  const value = useMemo(
    () => ({ user, authReady, refreshUser, login, registerCliente, logout }),
    [user, authReady, refreshUser, login, registerCliente, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
