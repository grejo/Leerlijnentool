import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Simple role-based auth without database lookup
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Role',
      credentials: {
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        const role = credentials?.role

        if (!role || !['ADMIN', 'DOCENT', 'STUDENT'].includes(role)) {
          return null
        }

        // Return a simple user object based on role
        const usersByRole: Record<string, { id: string; email: string; role: string }> = {
          ADMIN: { id: 'admin-1', email: 'admin@pxl.be', role: 'ADMIN' },
          DOCENT: { id: 'docent-1', email: 'docent@pxl.be', role: 'DOCENT' },
          STUDENT: { id: 'student-1', email: 'student@pxl.be', role: 'STUDENT' },
        }

        return usersByRole[role]
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
  secret: 'pxl-leerlijnentool-secret-key-2024',
}
