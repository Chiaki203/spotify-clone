'use client'

import { useRouter } from 'next/navigation'
import { BiSearch } from 'react-icons/bi'
import { HiHome } from 'react-icons/hi'
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx'
import { FaUserAlt } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'
import { User } from '@supabase/gotrue-js/src/lib/types'

import Button from './Button'
import useAuthModal from '@/hooks/useAuthModal'
import { createClient } from '@/lib/client/client'
import { toast } from 'react-hot-toast'
import usePlayer from '@/hooks/usePlayer'

interface HeaderProps {
  children: React.ReactNode
  className?: string
  user: User | null
}

const Header: React.FC<HeaderProps> = ({ children, className, user }) => {
  const router = useRouter()
  const authModal = useAuthModal()
  const supabase = createClient()
  const player = usePlayer()
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    player.reset()
    router.refresh()
    if (error) {
      toast.error(error.message)
      console.log('error logging out', error)
    } else {
      toast.success('Logged out!')
    }
  }
  return (
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b from-emerald-800 p-6`,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <HiHome className="text-black" size={20} />
          </button>
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex items-center gap-x-4">
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>
              <Button
                onClick={() => router.push('/account')}
                className="bg-white"
              >
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="bg-transparent text-neutral-300 font-medium"
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="bg-white px-6 py-2"
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export default Header
