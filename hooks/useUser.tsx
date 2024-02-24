import {
  createServerSupabaseClient,
  getSession,
  getSubscription,
  getUser,
  getUserDetails,
} from '@/lib/client/supbase'
import { Subscription, UserDetails } from '@/types'
import { User } from '@supabase/gotrue-js/src/lib/types'
import { createContext, useContext, useEffect, useState } from 'react'

type UserContextType = {
  // accessToken: string | null
  // user: User
  userDetails: UserDetails | null
  isLoading: boolean
  subscription: Subscription | null
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props {
  [propName: string]: any
}

export const MyUserContextProvider = (props: Props) => {
  // const supabase = createServerSupabaseClient()
  // const session = await getSession()
  // const user = getUser()
  // const accessToken = session?.access_token
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  useEffect(() => {
    const setUser = async () => {
      if (props.user && !isLoadingData && !userDetails && !subscription) {
        setIsLoadingData(true)
        const _userDetails = await getUserDetails()
        setUserDetails(_userDetails)
        const _subscription = await getSubscription()
        setSubscription(_subscription)
        setIsLoadingData(false)
      } else if (!props.user && !isLoadingData) {
        setUserDetails(null)
        setSubscription(null)
      }
    }
    setUser()
  }, [props.user])
  const value = {
    userDetails,
    isLoading: isLoadingData,
    subscription,
  }
  return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a MyUserContextProvider')
  }
  return context
}
