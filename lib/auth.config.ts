import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',  // 防止默认 /api/auth/error 页面 500 崩溃
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
    // 不使用 authorized 回调，路由保护由 middleware.ts 手动处理
  },
  providers: [],
  trustHost: true,
}
