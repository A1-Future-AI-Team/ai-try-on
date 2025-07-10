import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabaseUrl='https://pleucfotykikfmrltvdi.supabase.co'
const supabaseAnonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZXVjZm90eWtpa2Ztcmx0dmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMjY2MDQsImV4cCI6MjA2NzcwMjYwNH0.3EmpHnOn_yntZtwfMofVVcxM4raUSP6_SbgBH0rUVjs'

// debug
console.log('SUPABASE URL:', supabaseUrl)
console.log('SUPABASE KEY:', supabaseAnonKey)


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables not configured. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface TryOnResult {
  id: string
  user_id: string
  person_image_url: string
  clothing_image_url: string
  result_image_url: string
  created_at: string
  expires_at: string
}