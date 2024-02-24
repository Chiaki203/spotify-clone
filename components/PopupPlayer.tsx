import { getUser } from '@/lib/client/supbase'
import Player from './Player'

const PopupPlayer = async () => {
  const user = await getUser()
  return (
    <div>
      <Player user={user} />
    </div>
  )
}

export default PopupPlayer
