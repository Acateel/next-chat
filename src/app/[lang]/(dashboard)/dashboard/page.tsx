import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getDictionary } from '@/lib/locale/get-dictionary'
import { Locale } from '@/lib/locale/i18n-config'
import { chatHrefConstructor } from '@/lib/utils'
import { Message } from '@/lib/validations/message'
import { ChevronRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import LocaleLink from '@/components/ui/LocaleLink'
import { notFound } from 'next/navigation'

const Page = async ({ params: { lang } }: { params: { lang: Locale } }) => {
  const dictionary = await getDictionary(lang)
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        'zrange',
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[]
      const lastMessage = JSON.parse(lastMessageRaw) as Message
      return {
        ...friend,
        lastMessage,
      }
    })
  )

  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8 dark:text-indigo-100">
        {dictionary['dashboard'].recent_cahts}
      </h1>
      {/* Show last messages */}
      {friendsWithLastMessage.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          {dictionary['dashboard'].nothing_to_show_here}
        </p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative bg-zinc-50 border-zinc-200 p-3 rounded-md dark:bg-slate-700 dark:border-slate-900"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400" />
            </div>

            <LocaleLink
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    alt={`${friend.name} ${dictionary['dashboard'].profile_picture}`}
                    src={friend.image}
                    className="rounded-full"
                    referrerPolicy="no-referrer"
                    fill
                  />
                </div>
              </div>

              <div className="">
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  <span className="text-zinc-400">
                    {friend.lastMessage.senderId === session.user.id
                      ? `${dictionary['dashboard'].you}: `
                      : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </LocaleLink>
          </div>
        ))
      )}
    </div>
  )
}

export default Page
