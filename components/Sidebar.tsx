'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { BiSearch } from 'react-icons/bi'
import { HiHome } from 'react-icons/hi'
import Box from './Box'
import SidebarItem from './SidebarItem'
import Library from './Library'
import { headers } from 'next/headers'
import { getUser } from '@/lib/client/supbase'
import { Song, SubscriptionWithPrice } from '@/types'
import getSongsByUserId from '@/actions/getSongsByUserId'
import { User } from '@supabase/gotrue-js/src/lib/types'
import usePlayer from '@/hooks/usePlayer'
import { twMerge } from 'tailwind-merge'

interface SidebarProps {
  user: User | null
  userSongs: Song[]
  subscription: SubscriptionWithPrice
  children: React.ReactNode
  // songs: Song[]
}

// export const revalidate = 0

const Sidebar: React.FC<SidebarProps> = ({
  children,
  user,
  userSongs,
  subscription,
}) => {
  const pathname = usePathname()
  // const userSongs = await getSongsByUserId()
  // const pathname = headers().get('x-pathname') || ''
  console.log('pathname', pathname)
  const player = usePlayer()
  // const user = await getUser()
  const routes = [
    {
      icon: HiHome,
      label: 'Home',
      active: pathname !== '/search',
      href: '/',
    },
    {
      icon: BiSearch,
      label: 'Search',
      active: pathname === '/search',
      href: '/search',
    },
  ]

  // const routes = useMemo(
  //   () => [
  //     {
  //       icon: HiHome,
  //       label: 'Home',
  //       active: pathname !== '/search',
  //       href: '/',
  //     },
  //     {
  //       icon: BiSearch,
  //       label: 'Search',
  //       active: pathname === '/search',
  //       href: '/search',
  //     },
  //   ],
  //   [pathname]
  // )
  return (
    <div
      className={twMerge(
        `flex h-full`,
        player.activeId && 'h-[calc(100%-80px)]'
      )}
    >
      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
        <Box className="flex flex-col gap-y-4 px-5 py-4">
          {routes.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library user={user} songs={userSongs} subscription={subscription} />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
    </div>
  )
}

export default Sidebar
