import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { redirect } from 'next/navigation'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return session
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/unauthorized')
  }
  return session
}

export async function requireAdmin() {
  return requireRole(['ADMIN'])
}

export async function requireDocentOrAdmin() {
  return requireRole(['ADMIN', 'DOCENT'])
}

export function isAdmin(role?: string) {
  return role === 'ADMIN'
}

export function isDocent(role?: string) {
  return role === 'DOCENT'
}

export function isStudent(role?: string) {
  return role === 'STUDENT'
}
