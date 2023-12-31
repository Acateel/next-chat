'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { User } from 'lucide-react'
import LocaleLink from './ui/LocaleLink'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsSidebarOptionProps {
  sessionId: string
  initialUnseenRequestCount: number
  dictionary: {
    friend_requests: string
  }
}

const FriendRequestsSidebarOption: FC<FriendRequestsSidebarOptionProps> = ({
  sessionId,
  initialUnseenRequestCount,
  dictionary: { friend_requests },
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  )

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const friendRequestsHandler = () => {
      setUnseenRequestCount((prev) => prev + 1)
    }
    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1)
    }

    pusherClient.bind('incoming_friend_requests', friendRequestsHandler)
    pusherClient.bind('new_friend', addedFriendHandler)

    // clear connection
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
      pusherClient.unbind('incoming_friend_requests', friendRequestsHandler)
      pusherClient.unbind('new_friend', addedFriendHandler)
    }
  }, [sessionId, unseenRequestCount])

  return (
    <LocaleLink
      href="/dashboard/requests"
      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-zinc-50 dark:hover:bg-slate-600 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
    >
      <div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:text-indigo-800 dark:group-hover:text-indigo-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <User className="h-4 w-4" />
      </div>

      <p className="truncate">{friend_requests}</p>

      {unseenRequestCount > 0 ? (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
          {unseenRequestCount}
        </div>
      ) : null}
    </LocaleLink>
  )
}

export default FriendRequestsSidebarOption
