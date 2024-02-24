import { useRouter } from 'next/navigation'
import { User } from '@supabase/gotrue-js/src/lib/types'
import { createClient } from '@/lib/client/client'
import useAuthModal from '@/hooks/useAuthModal'
import { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { toast } from 'react-hot-toast'

interface LikeButtonProps {
  songId: string
  user: User | null
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId, user }) => {
  const router = useRouter()
  const supabase = createClient()
  const authModal = useAuthModal()
  const [isLiked, setIsLiked] = useState(false)
  useEffect(() => {
    if (!user?.id) {
      return
    }
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .single()
      if (!error && data) {
        setIsLiked(true)
      }
      // console.log('liked song', data)
    }
    fetchData()
  }, [songId, supabase, user?.id])
  const Icon = isLiked ? AiFillHeart : AiOutlineHeart
  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen()
    }
    if (isLiked) {
      const { error } = await supabase
        .from('liked_songs')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId)
      if (error) {
        toast.error('error.message')
        console.log('error deleting like', error)
      } else {
        setIsLiked(false)
      }
    } else {
      const { error } = await supabase.from('liked_songs').insert({
        user_id: user.id,
        song_id: songId,
      })
      if (error) {
        toast.error(error.message)
        console.log('error adding like', error)
      } else {
        setIsLiked(true)
        toast.success('Liked!')
      }
    }
    router.refresh()
  }
  return (
    <button className="hover:opacity-75 transition" onClick={handleLike}>
      <Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
    </button>
  )
}

export default LikeButton
