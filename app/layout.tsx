import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import ModalProvider from '@/providers/ModalProvider'
import ToasterProvider from '@/providers/ToasterProvider'
import getSongsByUserId from '@/actions/getSongsByUserId'
import Player from '@/components/Player'
import PopupPlayer from '@/components/PopupPlayer'
import { getSubscription, getUser } from '@/lib/client/supbase'
import getActiveProductsWithPrices from '@/actions/getActiveProductWithPrices'

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music!',
}

export const revalidate = 0

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()
  const userSongs = await getSongsByUserId()
  const products = await getActiveProductsWithPrices()
  const subscription = await getSubscription()

  // const userSongs = await getSongsByUserId()
  // console.log('font.className', font.className)
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <ModalProvider products={products} />
        <Sidebar user={user} userSongs={userSongs} subscription={subscription}>
          {children}
        </Sidebar>
        <PopupPlayer />
        {/* <Sidebar songs={userSongs}>{children}</Sidebar> */}
      </body>
    </html>
  )
}
