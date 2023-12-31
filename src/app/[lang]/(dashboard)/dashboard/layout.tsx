import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Icons } from '@/components/Icons'
import Image from 'next/image'
import SignOutButton from '@/components/SignOutButton'
import FriendRequestsSidebarOption from '@/components/FriendRequestsSidebarOption'
import { fetchRedis } from '@/helpers/redis'
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import SidebarChatList from '@/components/SidebarChatList'
import MobileChatLayout from '@/components/MobileChatLayout'
import { SidebarOption } from '@/types/typings'
import dynamic from 'next/dynamic'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import LocaleLink from '@/components/ui/LocaleLink'
import { Locale } from '@/lib/locale/i18n-config'
import { getDictionary } from '@/lib/locale/get-dictionary'

/**
 * Dissable ssr in ToogleLightModeButton for remove react error
 */
const ToogleLightModeButton = dynamic(
  () => import('@/components/ToogleLightModeButton'),
  { ssr: false }
)

interface LayoutProps {
  children: ReactNode
  params: {
    lang: Locale
  }
}

const Layout = async ({ children, params: { lang } }: LayoutProps) => {
  const dictionary = await getDictionary(lang)
  const session = await getServerSession(authOptions)

  if (!session) {
    notFound()
  }

  const sidebarOptions: SidebarOption[] = [
    {
      id: 1,
      name: dictionary['dashboard_layout'].add_friend,
      href: '/dashboard/add',
      Icon: 'UserPlus',
    },
  ]

  const friends = await getFriendsByUserId(session.user.id)

  // take requests count from database
  const unseenRequestCount = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length

  return (
    <div className="w-full flex h-screen dark:bg-slate-800">
      <div className="md:hidden">
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
          dictionary={dictionary['dashboard_layout']}
        />
      </div>
      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white dark:bg-slate-700 dark:border-slate-800 px-6">
        <LocaleLink
          href="/dashboard"
          className="flex h-16 shrink-0 items-center"
        >
          <Icons.Logo className="h-8 w-auto text-indigo-400" />
        </LocaleLink>
        {friends.length > 0 ? (
          <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-100">
            {dictionary['dashboard_layout'].your_chats}
          </div>
        ) : null}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            {/* Chats list */}
            <li>
              <SidebarChatList
                friends={friends}
                sessionId={session.user.id}
                dictionary={dictionary['dashboard_layout']}
              />
            </li>
            {/* Chats functions */}
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-100">
                {dictionary['dashboard_layout'].overview}
              </div>

              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const OptionIcon = Icons[option.Icon]
                  return (
                    <li key={option.id}>
                      <LocaleLink
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-zinc-50 dark:hover:bg-slate-600 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:text-indigo-800 dark:group-hover:text-indigo-800 flex h-6 w-6 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                          <OptionIcon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{option.name}</span>
                      </LocaleLink>
                    </li>
                  )
                })}
                {/* Friend Requests */}
                <li>
                  <FriendRequestsSidebarOption
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                    dictionary={dictionary['dashboard_layout']}
                  />
                </li>
              </ul>
            </li>
            {/* Additional functions */}
            <li className="h-full relative">
              <div className="absolute bottom-0 w-full flex flex-row items-center justify-between">
                <ToogleLightModeButton />
                <LocaleSwitcher />
              </div>
            </li>
            {/* User profile information */}
            <li className="-mx-6 mt-auto flex items-center relative">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200">
                <div className="relative h-8 w-8 bg-gray-50 dark:bg-inherit">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ''}
                    alt={dictionary['dashboard_layout'].your_profile_picture}
                  />
                </div>

                <span className="sr-only">
                  {dictionary['dashboard_layout'].your_profile}
                </span>
                <div className="flex flex-col">
                  <span aria-hidden="true" className="truncate">
                    {session.user.name}
                  </span>
                  <span
                    className="text-xs text-zinc-400 dark:text-zinc-300"
                    aria-hidden="true"
                  >
                    {session.user.email}
                  </span>
                </div>
              </div>
              <SignOutButton className="h-full aspect-square absolute right-0" />
            </li>
          </ul>
        </nav>
      </div>
      <aside className="max-h-screen container py-16 md:py-12 w-full">
        {children}
      </aside>
    </div>
  )
}

export default Layout
