'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [viewAsRole, setViewAsRole] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    if (session.user.role !== 'ADMIN' && !viewAsRole) {
      router.push('/')
    }
  }, [session, status, router, viewAsRole])

  const handleViewAs = (role: string) => {
    setViewAsRole(role)
    if (role === 'DOCENT') {
      router.push('/docent')
    } else if (role === 'STUDENT') {
      router.push('/student')
    }
  }

  const clearViewAs = () => {
    setViewAsRole(null)
    router.push('/admin')
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
          <h1 className="text-3xl font-bold text-gray-900">Beheerdersdashboard</h1>
          <p className="mt-2 text-gray-600">Welkom, beheerder</p>
        </div>

        {/* View As Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Bekijk als andere rol
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleViewAs('DOCENT')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Bekijk als Docent
            </button>
            <button
              onClick={() => handleViewAs('STUDENT')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Bekijk als Student
            </button>
          </div>
        </div>

        {/* Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Gebruikersbeheer
            </h2>
            <p className="text-gray-600">
              Beheer gebruikers, rollen en programma-toewijzingen
            </p>
          </Link>

          <Link
            href="/admin/programs"
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Programma's
            </h2>
            <p className="text-gray-600">Beheer opleidingsprogramma's</p>
          </Link>

          <Link
            href="/admin/learning-lines"
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Leerlijnen
            </h2>
            <p className="text-gray-600">
              Beheer leerlijnen en koppel deze aan programma's
            </p>
          </Link>

          <Link
            href="/admin/tracks"
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Leertrajecten
            </h2>
            <p className="text-gray-600">Beheer leertrajecten (jaren/fases)</p>
          </Link>

          <Link
            href="/admin/components"
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Leercomponenten
            </h2>
            <p className="text-gray-600">Beheer leercomponenten binnen leerlijnen</p>
          </Link>

          <Link
            href="/admin/contents"
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Leerinhoud
            </h2>
            <p className="text-gray-600">Beheer en bekijk alle leerinhoud</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
