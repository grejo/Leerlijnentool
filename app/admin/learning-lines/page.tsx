'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Program {
  id: string
  name: string
}

interface LearningLine {
  id: string
  title: string
  programs: { program: Program }[]
  components: any[]
}

export default function LearningLinesManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [learningLines, setLearningLines] = useState<LearningLine[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLine, setEditingLine] = useState<LearningLine | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    programIds: [] as string[],
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      const [llRes, progRes] = await Promise.all([
        fetch('/api/learning-lines'),
        fetch('/api/programs'),
      ])
      const llData = await llRes.json()
      const progData = await progRes.json()
      setLearningLines(llData)
      setPrograms(progData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (line?: LearningLine) => {
    if (line) {
      setEditingLine(line)
      setFormData({
        title: line.title,
        programIds: line.programs.map((p) => p.program.id),
      })
    } else {
      setEditingLine(null)
      setFormData({ title: '', programIds: [] })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingLine(null)
    setFormData({ title: '', programIds: [] })
  }

  const handleProgramToggle = (programId: string) => {
    setFormData((prev) => ({
      ...prev,
      programIds: prev.programIds.includes(programId)
        ? prev.programIds.filter((id) => id !== programId)
        : [...prev.programIds, programId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingLine) {
        const res = await fetch(`/api/learning-lines/${editingLine.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij bijwerken leerlijn')
          return
        }
      } else {
        const res = await fetch('/api/learning-lines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij aanmaken leerlijn')
          return
        }
      }

      await fetchData()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving learning line:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (lineId: string) => {
    if (!confirm('Weet u zeker dat u deze leerlijn wilt verwijderen?')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/learning-lines/${lineId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        alert('Fout bij verwijderen leerlijn')
        return
      }

      await fetchData()
    } catch (error) {
      console.error('Error deleting learning line:', error)
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Terug naar dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Leerlijnbeheer</h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Nieuwe leerlijn
          </button>
        </div>

        {loading && learningLines.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Laden...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Programma's
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Componenten
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {learningLines.map((line) => (
                  <tr key={line.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {line.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {line.programs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {line.programs.map((p) => (
                            <span
                              key={p.program.id}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                            >
                              {p.program.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Geen</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {line.components?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleOpenModal(line)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Bewerken
                      </button>
                      <button
                        onClick={() => handleDelete(line.id)}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingLine ? 'Leerlijn bewerken' : 'Nieuwe leerlijn'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titel *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gekoppelde programma's
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                      {programs.map((program) => (
                        <label key={program.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.programIds.includes(program.id)}
                            onChange={() => handleProgramToggle(program.id)}
                            className="mr-2"
                          />
                          <span className="text-sm">{program.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Opslaan...' : 'Opslaan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
