import { Song, SubscriptionWithPrice } from '@/types'
import usePlayer from './usePlayer'
import useAuthModal from './useAuthModal'
import { User } from '@supabase/gotrue-js/src/lib/types'
import useSubscribeModal from './useSubscribeModal'

const useOnPlay = (
  songs: Song[],
  user: User | null,
  subscription: SubscriptionWithPrice
) => {
  const player = usePlayer()
  const authModal = useAuthModal()
  const subscribeModal = useSubscribeModal()
  const onPlay = (id: string) => {
    if (!user) {
      return authModal.onOpen()
    }
    if (!subscription) {
      return subscribeModal.onOpen()
    }
    player.setId(id)
    player.setIds(songs.map((song) => song.id))
  }
  return onPlay
}

export default useOnPlay
