// MongoDB backend integration - replacing SQL workbench
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// const supabaseUrl='https://pleucfotykikfmrltvdi.supabase.co'
// const supabaseAnonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZXVjZm90eWtpa2Ztcmx0dmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMjY2MDQsImV4cCI6MjA2NzcwMjYwNH0.3EmpHnOn_yntZtwfMofVVcxM4raUSP6_SbgBH0rUVjs'

// debug
// console.log('SUPABASE URL:', supabaseUrl)
// console.log('SUPABASE KEY:', supabaseAnonKey)


// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Supabase environment variables not configured. Please check your .env file.')
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface TryOnResult {
  id: string
  user_id: string
  person_image_url: string
  clothing_image_url: string
  result_image_url: string
  created_at: string
  expires_at: string
}

// MongoDB backend API configuration
export const MONGODB_API_URL = (import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002'

// MongoDB API response types
export interface MongoDBUser {
  _id: string
  username: string
  email: string
  role: 'user' | 'admin'
  profileImage?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MongoDBImage {
  _id: string
  userId: string
  filename: string
  originalName: string
  url: string
  category: 'model' | 'dress' | 'result'
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface MongoDBTryOnSession {
  _id: string
  userId: string
  sessionId: string
  modelImageId: string
  dressImageId: string
  resultImageId?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  processingStartedAt?: string
  processingCompletedAt?: string
  errorMessage?: string
  metadata: {
    modelImageUrl: string
    dressImageUrl: string
    resultImageUrl?: string
    processingTime?: number
  }
  createdAt: string
  updatedAt: string
}

export interface MongoDBApiResponse<T = any> {
  status: 'success' | 'error'
  message: string
  data?: T
  timestamp: string
}