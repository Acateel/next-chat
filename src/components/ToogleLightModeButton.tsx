'use client'

import { FC } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-react'

interface ToogleModeProps {}

const ToogleLightModeButton: FC<ToogleModeProps> = ({}) => {
  const { systemTheme, theme, setTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDarkTheme = theme === 'dark'
  return (
    <div
      className="w-14 h-8 rounded-full bg-slate-600 dark:bg-gray-200  relative cursor-pointer transition-colors"
      onClick={() => (isDarkTheme ? setTheme('light') : setTheme('dark'))}
    >
      <div
        className={cn(
          'h-6 w-6 rounded-full bg-gray-200 dark:bg-slate-600 absolute top-1 transition-all',
          {
            'left-1': !isDarkTheme,
            'left-7': isDarkTheme,
          }
        )}
      >
        {isDarkTheme ? <Sun className="p-0.5" /> : <Moon className="p-0.5" />}
      </div>
    </div>
  )
}

export default ToogleLightModeButton
