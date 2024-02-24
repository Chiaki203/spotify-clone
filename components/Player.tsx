'use client'

import useGetSongById from '@/hooks/useGetSongById'
import useLoadSongUrl from '@/hooks/useLoadSongUrl'
import usePlayer from '@/hooks/usePlayer'
import PlayerContent from './PlayerContent'
import { User } from '@supabase/gotrue-js/src/lib/types'

interface PlayerProps {
  user: User | null
}

const Player = ({ user }: PlayerProps) => {
  const player = usePlayer()
  const { song } = useGetSongById(player.activeId)
  const songUrl = useLoadSongUrl(song!)
  // console.log('player song activeId', player.activeId)
  // console.log('player song ids', player.ids)
  if (!song || !songUrl || !player.activeId) {
    return null
  }
  return (
    <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">
      <PlayerContent key={songUrl} user={user} song={song} songUrl={songUrl} />
    </div>
  )
}

export default Player
