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

      <div className="container-pxl section-pxl">
        <div className="mb-12">
          <h1 className="text-4xl font-heading font-black text-pxl-black accent-gold">
            Beheerdersdashboard
          </h1>
          <p className="mt-4 text-lg text-gray-600">Welkom, beheerder</p>
        </div>

        {/* View As Section */}
        <div className="card-pxl mb-12">
          <h2 className="text-2xl font-heading font-black text-pxl-black mb-6">
            Bekijk als andere rol
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleViewAs('DOCENT')}
              className="btn-pxl-secondary"
            >
              Bekijk als Docent
            </button>
            <button
              onClick={() => handleViewAs('STUDENT')}
              className="btn-pxl-secondary"
            >
              Bekijk als Student
            </button>
          </div>
        </div>

        {/* Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="card-pxl-hover block"
          >
            <h2 className="text-xl font-heading font-bold text-pxl-black mb-3">
              Gebruikersbeheer
            </h2>
            <p className="text-gray-600">
              Beheer gebruikers, rollen en opleiding-toewijzingen
            </p>
          </Link>

          <Link
            href="/admin/programs"
            className="card-pxl-hover block"
          >
            <h2 className="text-xl font-heading font-bold text-pxl-black mb-3">
              Opleidingen
            </h2>
            <p className="text-gray-600">Beheer opleidingen en koppel docenten</p>
          </Link>

          <Link
            href="/admin/learning-lines"
            className="card-pxl-hover block"
          >
            <h2 className="text-xl font-heading font-bold text-pxl-black mb-3">
              Leerlijnen
            </h2>
            <p className="text-gray-600">
              Beheer leerlijnen en koppel deze aan opleidingen
            </p>
          </Link>

          <Link
            href="/admin/tracks"
            className="card-pxl-hover block"
          >
            <h2 className="text-xl font-heading font-bold text-pxl-black mb-3">
              Leertrajecten
            </h2>
            <p className="text-gray-600">Beheer leertrajecten (jaren/fases)</p>
          </Link>

          <Link
            href="/admin/courses"
            className="card-pxl-hover block"
          >
            <h2 className="text-xl font-heading font-bold text-pxl-black mb-3">
              Opleidingsonderdelen
            </h2>
            <p className="text-gray-600">Beheer vakken binnen opleidingen</p>
          </Link>

          <Link
            href="/admin/components"
            className="card-pxl-hover block"
          >
            <h2 className="text-xl font-heading font-bold text-pxl-black mb-3">
              Vakgebieden
            </h2>
            <p className="text-gray-600">Beheer vakgebieden binnen leerlijnen</p>
          </Link>

          <Link
            href="/admin/contents"
            className="card-pxl-hover block"
          >
            <h2 className="text-xl font-heading font-bold text-pxl-black mb-3">
              Leerinhoud
            </h2>
            <p className="text-gray-600">Beheer en bekijk alle leerinhoud</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
