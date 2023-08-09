'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { i18n } from '@/lib/locale/i18n-config'
import { useState } from 'react'
import { Languages, WholeWordIcon } from 'lucide-react'

export default function LocaleSwitcher() {
  const pathName = usePathname()
  const [isActive, setIsActive] = useState<boolean>(false)

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  return (
    <div className="relative">
      <div
        className="active:scale-95 inline-flex items-center justify-center text-slate-900 dark:text-gray-200 cursor-pointer hover:text-indigo-600 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md transition-colors p-3"
        onClick={() => setIsActive((prev) => !prev)}
      >
        <Languages />
      </div>
      {isActive ? (
        <ul className='absolute bg-gray-200 dark:bg-slate-600  py-2 px-4 rounded-md bottom-0 -left-14 opacity-90'>
          {i18n.locales.map((locale) => (
            <li key={locale} className='my-1 font-semibold hover:text-indigo-600 dark:hover:text-gray-200 transition-colors '>
              <Link href={redirectedPathName(locale)}>{locale.toUpperCase()}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
