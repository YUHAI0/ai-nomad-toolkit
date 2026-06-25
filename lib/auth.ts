import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminPassword = process.env.ADMIN_PASSWORD
        if (!adminPassword) return null
        if (credentials?.password !== adminPassword) return null
        return { id: 'admin', name: 'Admin', email: 'admin@localhost' }
      },
    }),
  ],
})
