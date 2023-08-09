'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, ReactNode } from 'react'
interface LocaleLinkProps extends LinkProps {
  children: ReactNode
  className: string
}

/**
 * Link what add locale from past pathname
 * @param param0 
 * @returns 
 */
const LocaleLink: FC<LocaleLinkProps> = ({
  children,
  className,
  href,
  ...props
}) => {
  const pathname = usePathname()
  const url = href.toString()

  if (!pathname) {
    return <Link href={url} {...props} />
  }

  const segments = pathname.split('/')
  const locale = segments[1]

  return (
    <Link href={`/${locale}${url}`} className={className} {...props}>
      {children}
    </Link>
  )
}

export default LocaleLink
