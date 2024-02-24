import Header from '@/components/Header'
import { getSubscription, getUser } from '@/lib/client/supbase'
import AccountContent from './components/AccountContent'

const Account = async () => {
  const user = await getUser()
  const subscription = await getSubscription()
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header user={user} className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Account Settings
          </h1>
        </div>
      </Header>
      <AccountContent user={user} subscription={subscription} />
    </div>
  )
}

export default Account
