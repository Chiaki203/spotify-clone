'use client'

import { MyUserContextProvider } from '@/hooks/useUser'
import { User } from '@supabase/gotrue-js/src/lib/types'

interface UserProviderProps {
  children: React.ReactNode
  user: User
}

const UserProvider: React.FC<UserProviderProps> = ({ children, user }) => {
  return <MyUserContextProvider user={user}>{children}</MyUserContextProvider>
}

export default UserProvider
