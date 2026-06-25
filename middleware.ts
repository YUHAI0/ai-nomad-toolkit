import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import type { NextAuthConfig } from 'next-auth'

const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string
      return session
    },
  },
  providers: [],
  trustHost: true,
}

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL('/admin/tools', req.url))
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', req.nextUrl.pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
})

export const config = {
  matcher: ['/admin/:path*'],
}
