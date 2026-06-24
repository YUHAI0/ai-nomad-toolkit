import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { db } = await import('./db')
        const schema = process.env.DB_DRIVER === 'postgres'
          ? await import('./schema/postgres')
          : await import('./schema/sqlite')

        const users = await (db as any)
          .select()
          .from(schema.adminUsers)
          .where(eq(schema.adminUsers.email, credentials.email as string))

        const user = users[0]
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null

        return { id: user.id, email: user.email }
      },
    }),
  ],
})
