import { createClient } from '@supabase/supabase-js'

function requireEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const raw = import.meta.env[name]
  const v = typeof raw === 'string' ? raw.trim() : ''
  if (!v) {
    const hint =
      import.meta.env.PROD
        ? ' En Vercel: Settings → Environment Variables (Production), luego Redeploy.'
        : ' Crea carwash-web/.env desde .env.example.'
    throw new Error(`Falta ${name}.${hint}`)
  }
  return v
}

function getSupabaseUrl(): string {
  const v = requireEnv('VITE_SUPABASE_URL')
  try {
    const url = new URL(v)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('protocol')
    }
    return url.href.replace(/\/$/, '')
  } catch {
    throw new Error(
      `VITE_SUPABASE_URL no es válida: "${v.slice(0, 60)}". Debe ser https://TU-REF.supabase.co (sin comillas).`,
    )
  }
}

function getSupabaseAnonKey(): string {
  return requireEnv('VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  getSupabaseUrl(),
  getSupabaseAnonKey(),
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
