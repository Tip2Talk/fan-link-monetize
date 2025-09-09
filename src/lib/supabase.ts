import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fabqccbzizrmxtzdeuzz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYnFjY2J6aXpybXh0emRldXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MDg5MTEsImV4cCI6MjA3MDM4NDkxMX0.I0lB4CKJgNXd93UhVOPjxQJcmQNQe0j2JNj2KGJ7s8Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  email?: string
  username?: string
  display_name?: string
  bio?: string
  avatar_url?: string
  is_creator: boolean
  follower_count: number
  verified: boolean
  tip_goal: number
  tip_received: number
  created_at: string
  updated_at: string
}

export type Conversation = {
  id: string
  creator_id: string
  fan_id: string
  last_message_at: string
  created_at: string
  creator?: Profile
  fan?: Profile
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'tip' | 'media'
  tip_amount?: number
  read_at?: string
  created_at: string
  sender?: Profile
}

export type Tip = {
  id: string
  from_user_id: string
  to_creator_id: string
  amount: number
  message?: string
  stripe_payment_id?: string
  conversation_id?: string
  created_at: string
}

export type VideoCall = {
  id: string
  creator_id: string
  fan_id: string
  duration_minutes: number
  price: number
  scheduled_at: string
  status: 'scheduled' | 'completed' | 'cancelled'
  meeting_url?: string
  stripe_payment_id?: string
  created_at: string
}