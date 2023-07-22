'use client'

import { FC } from 'react'
import { useTheme } from 'next-themes'
import Button from './ui/Button'

interface ToogleModeProps {}

const ToogleLightModeButton: FC<ToogleModeProps> = ({}) => {
  const { systemTheme, theme, setTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  return (
    <Button
      onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
      variant={theme == 'dark' ? 'ghost' : 'default'}
    >
      Light mode
    </Button>
  )
}

export default ToogleLightModeButton
