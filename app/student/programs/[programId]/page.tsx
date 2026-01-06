'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Component {
  id: string
  name: string
  order: number
}

interface LearningLine {
  id: string
  title: string
  components: Component[]
}

interface Program {
  id: string
  name: string
  learningLines: { learningLine: LearningLine }[]
}

export default function ProgramLearningLines() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const programId = params.programId as string

  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLearningLineId, setSelectedLearningLineId] = useState<string>('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    fetchProgram()
  }, [session, status, programId, router])

  const fetchProgram = async () => {
    try {
      const res = await fetch(`/api/programs/${programId}`)
      if (res.ok) {
        const data = await res.json()
        setProgram(data)
      }
    } catch (error) {
      console.error('Error fetching program:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLearningLineSelect = (learningLineId: string) => {
    if (learningLineId) {
      router.push(`/student/programs/${programId}/learning-lines/${learningLineId}`)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    )
  }

  if (!session || !program) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={session.user.email || ''} userRole={session.user.role} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/student"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Terug naar opleidingen
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{program.name}</h1>
          <p className="mt-2 text-gray-600">Selecteer een leerlijn om de inhoud te bekijken</p>
        </div>

        {/* Quick Selector Dropdown */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Ga snel naar leerlijn:
            </label>
            <select
              value={selectedLearningLineId}
              onChange={(e) => handleLearningLineSelect(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecteer een leerlijn...</option>
              {program.learningLines.map((pl) => (
                <option key={pl.learningLine.id} value={pl.learningLine.id}>
                  {pl.learningLine.title} ({pl.learningLine.components.length} vakgebieden)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid View of Learning Lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {program.learningLines.map((pl) => (
            <Link
              key={pl.learningLine.id}
              href={`/student/programs/${programId}/learning-lines/${pl.learningLine.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200 hover:border-blue-300"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {pl.learningLine.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {pl.learningLine.components.length} vakgebied
                  {pl.learningLine.components.length !== 1 ? 'en' : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {program.learningLines.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">
              Er zijn nog geen leerlijnen gekoppeld aan deze opleiding.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
