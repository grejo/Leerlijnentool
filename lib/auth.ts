import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db, users } from './db'
import { eq } from 'drizzle-orm'

// Default users for each role (created by seed script)
const defaultUsersByRole: Record<string, string> = {
  ADMIN: 'admin@pxl.be',
  DOCENT: 'jan.docent@pxl.be',
  STUDENT: 'student@pxl.be',
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'Role',
      credentials: {
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const role = credentials?.role as string

          if (!role || !['ADMIN', 'DOCENT', 'STUDENT'].includes(role)) {
            console.error('Invalid role:', role)
            return null
          }

          // Get the default user for this role
          const defaultEmail = defaultUsersByRole[role]

          try {
            const user = await db.query.users.findFirst({
              where: eq(users.email, defaultEmail),
            })

            if (user) {
              return {
                id: user.id,
                email: user.email,
                role: user.role,
              }
            }
          } catch (dbError) {
            console.error('Database error:', dbError)
          }

          // If no user exists in DB, create a virtual session with the selected role
          return {
            id: `virtual-${role.toLowerCase()}`,
            email: defaultEmail,
            role: role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'pxl-leerlijnentool-secret-key-2024',
}
