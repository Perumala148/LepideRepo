import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails fast in dev/build if .env is missing instead of silently breaking auth calls
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Profile {
  id: string
  full_name: string
  email: string
  created_at: string
}
