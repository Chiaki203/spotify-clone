'use client'

import { Song, SubscriptionWithPrice } from '@/types'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/gotrue-js/src/lib/types'
import { useEffect } from 'react'
import MediaItem from '@/components/MediaItem'
import LikeButton from '@/components/LikeButton'
import useOnPlay from '@/hooks/useOnPlay'

interface LikedContentProps {
  songs: Song[]
  user: User | null
  subscription: SubscriptionWithPrice
}

const LikedContent: React.FC<LikedContentProps> = ({
  songs,
  user,
  subscription,
}) => {
  const router = useRouter()
  const onPlay = useOnPlay(songs, user, subscription)
  useEffect(() => {
    if (!user) {
      router.replace('/')
    }
  }, [user, router])
  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        No liked songs.
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-y-2 w-full p-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem data={song} onClick={(id) => onPlay(id)} />
          </div>
          <LikeButton songId={song.id} user={user} />
        </div>
      ))}
    </div>
  )
}

export default LikedContent
