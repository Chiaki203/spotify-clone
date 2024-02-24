import getSongsByTitle from '@/actions/getSongsByTitle'
import Header from '@/components/Header'
import SearchInput from '@/components/SearchInput'
import { getSubscription, getUser } from '@/lib/client/supbase'
import SearchContent from './components/SearchContent'

interface searchProps {
  searchParams: {
    title: string
  }
}

export const revalidate = 0

const Search = async ({ searchParams }: searchProps) => {
  const user = await getUser()
  const songs = await getSongsByTitle(searchParams.title)
  const subscription = await getSubscription()
  // console.log('search songs', songs)
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header user={user} className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} user={user} subscription={subscription} />
    </div>
  )
}

export default Search
