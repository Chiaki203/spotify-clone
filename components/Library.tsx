'use client'

import useAuthModal from '@/hooks/useAuthModal'
import { AiOutlinePlus } from 'react-icons/ai'
import { TbPlaylist } from 'react-icons/tb'
import { User } from '@supabase/gotrue-js/src/lib/types'
import useUploadModal from '@/hooks/useUploadModal'
import { Song, SubscriptionWithPrice } from '@/types'
import MediaItem from './MediaItem'
import useOnPlay from '@/hooks/useOnPlay'
import useSubscribeModal from '@/hooks/useSubscribeModal'

interface LibraryProps {
  user: User | null
  songs: Song[]
  subscription: SubscriptionWithPrice
}

const Library = ({ user, songs, subscription }: LibraryProps) => {
  const authModal = useAuthModal()
  const uploadModal = useUploadModal()
  const subscribeModal = useSubscribeModal()
  const onPlay = useOnPlay(songs, user, subscription)
  // console.log('Library user', user)
  const onClick = () => {
    if (!user) {
      return authModal.onOpen()
    }
    if (!subscription) {
      return subscribeModal.onOpen()
    }
    return uploadModal.onOpen()
    // handle upload
  }
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist size={26} className="text-neutral-400" />
          <p className="text-neutral-400 font-medium text-md">Your Library</p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className="text-neutral-400 hover:text-white cursor-pointer transition"
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((song) => (
          <MediaItem
            key={song.id}
            data={song}
            onClick={(id: string) => onPlay(id)}
          />
        ))}
      </div>
    </div>
  )
}

export default Library
