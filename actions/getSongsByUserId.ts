import { getUser } from '@/lib/client/supbase'
import { createClient } from '@/lib/server/action'
import { Song } from '@/types'
import { cookies } from 'next/headers'

const getSongsByUserId = async (): Promise<Song[]> => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const user = await getUser()
  if (!user) {
    console.log('No user signed in')
    return []
  }
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) {
    console.log('error getting songs', error)
  }
  return data || []
}

export default getSongsByUserId
