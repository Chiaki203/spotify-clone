import { createClient } from '@/lib/client/client'
import { Song } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [song, setSong] = useState<Song | undefined>(undefined)
  const supabase = createClient()
  useEffect(() => {
    if (!id) {
      return
    }
    setIsLoading(true)
    const fetchSong = async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        setIsLoading(false)
        console.log('error getting song by id', error)
        return toast.error(error.message)
      }
      setSong(data as Song)
      setIsLoading(false)
    }
    fetchSong()
  }, [id, supabase])
  return useMemo(
    () => ({
      isLoading,
      song,
    }),
    [isLoading, song]
  )
}

export default useGetSongById
