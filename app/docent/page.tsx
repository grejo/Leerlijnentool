'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Program {
  id: string
  name: string
}

export default function DocentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [viewAsRole, setViewAsRole] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    if (!['ADMIN', 'DOCENT'].includes(session.user.role) && !viewAsRole) {
      router.push('/')
      return
    }
    fetchPrograms()
  }, [session, status, router, viewAsRole])

  const fetchPrograms = async () => {
    if (!session) return

    try {
      const res = await fetch(`/api/programs?userId=${session.user.id}`)
      const data = await res.json()
      setPrograms(data)
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewAs = (role: string) => {
    setViewAsRole(role)
    if (role === 'STUDENT') {
      router.push('/student')
    }
  }

  const clearViewAs = () => {
    setViewAsRole(null)
    if (session?.user.role === 'ADMIN') {
      router.push('/admin')
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={session.user.email || ''}
        userRole={session.user.role}
        viewAsRole={viewAsRole || undefined}
        onClearViewAs={clearViewAs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Docenten Dashboard</h1>
          <p className="mt-2 text-gray-600">Welkom, {session.user.email}</p>
        </div>

        {/* View As Section for Docent */}
        {session.user.role === 'DOCENT' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Bekijk als Student
            </h2>
            <button
              onClick={() => handleViewAs('STUDENT')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Bekijk als Student
            </button>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Uw toegewezen programma's
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Link
                key={program.id}
                href={`/docent/programs/${program.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {program.name}
                </h3>
                <p className="text-sm text-gray-600">Beheer leerinhoud</p>
              </Link>
            ))}
          </div>
          {loading && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">Laden...</p>
            </div>
          )}
          {!loading && programs.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">
                U bent nog niet toegewezen aan programma's. Neem contact op met de beheerder.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
