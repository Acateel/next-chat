import { FC } from 'react'
import { Icons } from '@/components/Icons'
import GoogleLoginButton from '@/components/ui/GoogleLoginButton'
import { Locale } from '@/lib/locale/i18n-config'
import { getDictionary } from '@/lib/locale/get-dictionary'

interface pageProps {
  params: {
    lang: Locale
  }
}

const Page = async ({ params: { lang } }: pageProps) => {
  const dictionary = await getDictionary(lang)

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            <Icons.Logo className="h-8 w-auto text-indigo-600" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-200">
              {dictionary['login'].sign_in}
            </h2>
          </div>

          <GoogleLoginButton dictionary={dictionary['login']} />
        </div>
      </div>
    </>
  )
}

export default Page
