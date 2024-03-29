'use client'

import LikeButton from '@/components/LikeButton'
import MediaItem from '@/components/MediaItem'
import useOnPlay from '@/hooks/useOnPlay'
import { Song, SubscriptionWithPrice } from '@/types'
import { User } from '@supabase/gotrue-js/src/lib/types'

interface SearchContentProps {
  songs: Song[]
  user: User | null
  subscription: SubscriptionWithPrice
}

const SearchContent: React.FC<SearchContentProps> = ({
  songs,
  user,
  subscription,
}) => {
  const onPlay = useOnPlay(songs, user, subscription)
  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        No songs found.
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem data={song} onClick={(id: string) => onPlay(id)} />
          </div>
          <LikeButton user={user} songId={song.id} />
        </div>
      ))}
    </div>
  )
}

export default SearchContent
