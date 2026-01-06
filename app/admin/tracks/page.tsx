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

interface TrackProgram {
  program: Program
}

interface Track {
  id: string
  name: string
  order: number
  createdAt: string
  programs: TrackProgram[]
}

export default function TracksManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tracks, setTracks] = useState<Track[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    order: 0,
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
      const [tracksRes, programsRes] = await Promise.all([
        fetch('/api/tracks'),
        fetch('/api/programs'),
      ])
      const tracksData = await tracksRes.json()
      const programsData = await programsRes.json()
      setTracks(tracksData)
      setPrograms(programsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (track?: Track) => {
    if (track) {
      setEditingTrack(track)
      setFormData({
        name: track.name,
        order: track.order,
        programIds: track.programs.map((tp) => tp.program.id),
      })
    } else {
      setEditingTrack(null)
      setFormData({ name: '', order: tracks.length, programIds: [] })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTrack(null)
    setFormData({ name: '', order: 0, programIds: [] })
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
      if (editingTrack) {
        const res = await fetch(`/api/tracks/${editingTrack.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij bijwerken leertraject')
          return
        }
      } else {
        const res = await fetch('/api/tracks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij aanmaken leertraject')
          return
        }
      }

      await fetchData()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving track:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (trackId: string) => {
    if (!confirm('Weet u zeker dat u dit leertraject wilt verwijderen?')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/tracks/${trackId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        alert('Fout bij verwijderen leertraject')
        return
      }

      await fetchData()
    } catch (error) {
      console.error('Error deleting track:', error)
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
            <h1 className="text-3xl font-bold text-gray-900">Leertrajectenbeheer</h1>
            <p className="text-gray-600 mt-2">Beheer leertrajecten zoals jaren, fases, etc.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Nieuw leertraject
          </button>
        </div>

        {loading && tracks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Laden...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Naam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opleidingen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volgorde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tracks.map((track) => (
                  <tr key={track.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {track.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {track.programs && track.programs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {track.programs.map((tp) => (
                            <span
                              key={tp.program.id}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                            >
                              {tp.program.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Geen</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {track.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleOpenModal(track)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Bewerken
                      </button>
                      <button
                        onClick={() => handleDelete(track.id)}
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
                {editingTrack ? 'Leertraject bewerken' : 'Nieuw leertraject'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Naam *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      placeholder="bijv. Jaar 1, Fase 2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volgorde
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: parseInt(e.target.value) })
                      }
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gekoppelde opleidingen
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white">
                      {programs.map((program) => (
                        <label key={program.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.programIds.includes(program.id)}
                            onChange={() => handleProgramToggle(program.id)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-900">{program.name}</span>
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
