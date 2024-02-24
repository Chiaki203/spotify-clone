import { createClient } from '@/lib/client/client'
import { Song } from '@/types'

const useLoadSongUrl = (song: Song) => {
  const supabase = createClient()
  if (!song) {
    return ''
  }
  const { data: songData } = supabase.storage
    .from('songs')
    .getPublicUrl(song.song_path)
  console.log('useLoadSong songData', songData)
  return songData.publicUrl
}

export default useLoadSongUrl
