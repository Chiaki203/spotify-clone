'use client'

import { Database } from '@/types_db'
import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'

interface SupabaseProviderProps {
  children: React.ReactNode
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabaseClient] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )
  return <></>
}
