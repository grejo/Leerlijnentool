import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-helpers'

export default async function Home() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Redirect based on role
  switch (session.user.role) {
    case 'ADMIN':
      redirect('/admin')
    case 'DOCENT':
      redirect('/docent')
    case 'STUDENT':
      redirect('/student')
    default:
      redirect('/login')
  }
}
