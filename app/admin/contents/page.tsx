'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Content {
  id: string
  richTextBody: string
  program: { id: string; name: string }
  learningLine: { id: string; title: string }
  component: { id: string; name: string }
  track: { id: string; name: string }
  course: { id: string; name: string }
  createdBy: { email: string }
}

interface Program {
  id: string
  name: string
}

export default function ContentsManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProgramId, setSelectedProgramId] = useState<string>('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchData()
  }, [session, status, router])

  useEffect(() => {
    if (programs.length > 0 && !selectedProgramId) {
      setSelectedProgramId(programs[0].id)
    }
  }, [programs])

  useEffect(() => {
    if (selectedProgramId) {
      fetchContents()
    }
  }, [selectedProgramId])

  const fetchData = async () => {
    try {
      const progRes = await fetch('/api/programs')
      const progData = await progRes.json()
      setPrograms(progData)
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchContents = async () => {
    if (!selectedProgramId) return

    try {
      setLoading(true)
      const res = await fetch(`/api/contents?programId=${selectedProgramId}`)
      const data = await res.json()
      setContents(data)
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (contentId: string) => {
    if (!confirm('Weet u zeker dat u deze inhoud wilt verwijderen?')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/contents/${contentId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        alert('Fout bij verwijderen inhoud')
        return
      }

      await fetchContents()
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setLoading(false)
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
      <Navbar userName={session.user.email || ''} userRole={session.user.role} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Terug naar dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Leerinhoud Overzicht</h1>
          <p className="text-gray-600 mt-2">Bekijk en beheer alle leerinhoud per programma</p>
        </div>

        {/* Program Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecteer Programma
          </label>
          <select
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        {loading && contents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Laden...</p>
          </div>
        ) : contents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Geen inhoud gevonden voor dit programma</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leerlijn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Component
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Traject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gemaakt door
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contents.map((content) => (
                  <tr key={content.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {content.learningLine.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {content.component.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {content.track.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {content.course.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {content.createdBy.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Verwijderen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
