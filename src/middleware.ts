import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

import { i18n } from '@/lib/locale/i18n-config'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

/**
 * Get user locale
 * @param request
 * @returns locale in string type
 */
function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  )

  const locale = matchLocale(languages, locales, i18n.defaultLocale)

  return locale
}

/**
 * add subpath with locale in response url
 * @param request NextRequest from middleware
 * @param pathname string pathname
 * @returns next response with locale's subpath
 */
export function localeMiddleware(request: NextRequest, pathname: string) {
  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  // if (
  //   [
  //     '/manifest.json',
  //     '/favicon.ico',
  //     // Your other files in `public`
  //   ].includes(pathname)
  // )
  //   return

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }

  return NextResponse.next()
}

/**
 * Middleware with auth
 */
export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname

    // Manage route protection
    const isAuth = await getToken({ req })
    const isLoginPage = pathname.includes('/login')

    const sensitiveRoutes = ['/dashboard']
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.includes(route)
    )

    if (isLoginPage) {
      if (isAuth) {
        return localeMiddleware(req, '/dashboard')
      }

      return localeMiddleware(req, pathname)
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return localeMiddleware(req, '/login')
    }

    if (pathname === '/') {
      return localeMiddleware(req, '/dashboard')
    }

    return localeMiddleware(req, pathname)
  },
  {
    // callbacks for call widleware every time
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

/**
 * With what pages middleware will work
 */
export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
