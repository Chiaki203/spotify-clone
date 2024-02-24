import getSongs from '@/actions/getSongs'
import Header from '@/components/Header'
import ListItem from '@/components/ListItem'
import { getSubscription, getUser } from '@/lib/client/supbase'
import { createClient } from '@/lib/server/server'
import { cookies } from 'next/headers'
import Image from 'next/image'
import PageContent from './components/PageContent'

export const revalidate = 0

export default async function Home() {
  // const cookieStore = cookies()
  // const supabase = createClient(cookieStore)
  const user = await getUser()
  console.log('home user', user)
  const songs = await getSongs()
  const subscription = await getSubscription()
  // throw new Error('test')

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header user={user}>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">Welcome back</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem
              image="/images/liked.png"
              name="Liked Songs"
              href="liked"
            />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Newest Songs</h1>
        </div>
        <PageContent songs={songs} user={user} subscription={subscription} />
        {/* <div>
          {songs.map((song) => (
            <div key={song.id}>{song.title}</div>
          ))}
        </div> */}
      </div>
    </div>
  )
}
