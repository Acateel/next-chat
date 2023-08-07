import { withAuth } from 'next-auth/middleware'
import authMiddleware from './lib/middlewares/authMiddleware'
import localeMiddleware from './lib/middlewares/localeMiddleware'

/**
 * Middleware
 */
export default withAuth(
  async function middleware(req) {
    const pathname = await authMiddleware(req)
    const response = localeMiddleware(req, pathname)
    return response
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
