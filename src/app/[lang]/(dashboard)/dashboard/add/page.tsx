import AddFriendButton from '@/components/AddFriendButton'
import { getDictionary } from '@/lib/locale/get-dictionary'
import { Locale } from '@/lib/locale/i18n-config'

interface AddFriendPage {
  params: { lang: Locale }
}

const page = async ({ params: { lang } }: AddFriendPage) => {
  const dictionary = await getDictionary(lang)

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">
        {dictionary['add_friend_page'].add_a_friend}
      </h1>
      <AddFriendButton dictionary={dictionary.add_friend_page} />
    </main>
  )
}

export default page
