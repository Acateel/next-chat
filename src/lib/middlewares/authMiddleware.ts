import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function authMiddleware(req: NextRequest) {
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
      return '/dashboard'
    }

    return pathname
  }

  if (!isAuth && isAccessingSensitiveRoute) {
    return '/login'
  }

  if (pathname === '/') {
    return '/dashboard'
  }

  return pathname
}
