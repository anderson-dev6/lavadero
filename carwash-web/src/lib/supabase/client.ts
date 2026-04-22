import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl(): string {
  const v = import.meta.env.VITE_SUPABASE_URL?.trim()
  if (v) return v
  throw new Error(
    'Falta VITE_SUPABASE_URL en .env (véase .env.example).',
  )
}

function getSupabaseAnonKey(): string {
  const v = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  if (v) return v
  throw new Error(
    'Falta VITE_SUPABASE_ANON_KEY en .env (véase .env.example).',
  )
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
