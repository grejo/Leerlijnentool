'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface LearningLine {
  id: string
  title: string
}

interface Component {
  id: string
  name: string
  order: number
  learningLine: LearningLine
}

export default function ComponentsManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [components, setComponents] = useState<Component[]>([])
  const [learningLines, setLearningLines] = useState<LearningLine[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingComponent, setEditingComponent] = useState<Component | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    learningLineId: '',
    order: 0,
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
      const [compRes, llRes] = await Promise.all([
        fetch('/api/components'),
        fetch('/api/learning-lines'),
      ])
      const compData = await compRes.json()
      const llData = await llRes.json()
      setComponents(compData)
      setLearningLines(llData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (component?: Component) => {
    if (component) {
      setEditingComponent(component)
      setFormData({
        name: component.name,
        learningLineId: component.learningLine.id,
        order: component.order,
      })
    } else {
      setEditingComponent(null)
      setFormData({ name: '', learningLineId: '', order: 0 })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingComponent(null)
    setFormData({ name: '', learningLineId: '', order: 0 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingComponent) {
        const res = await fetch(`/api/components/${editingComponent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij bijwerken component')
          return
        }
      } else {
        const res = await fetch('/api/components', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij aanmaken component')
          return
        }
      }

      await fetchData()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving component:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (componentId: string) => {
    if (!confirm('Weet u zeker dat u deze component wilt verwijderen?')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/components/${componentId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        alert('Fout bij verwijderen component')
        return
      }

      await fetchData()
    } catch (error) {
      console.error('Error deleting component:', error)
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
            <h1 className="text-3xl font-bold text-gray-900">Vakgebiedenbeheer</h1>
            <p className="text-gray-600 mt-2">Beheer vakgebieden binnen leerlijnen</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Nieuw vakgebied
          </button>
        </div>

        {loading && components.length === 0 ? (
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
                    Leerlijn
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
                {components.map((component) => (
                  <tr key={component.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {component.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {component.learningLine.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {component.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleOpenModal(component)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Bewerken
                      </button>
                      <button
                        onClick={() => handleDelete(component.id)}
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
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {editingComponent ? 'Vakgebied bewerken' : 'Nieuw vakgebied'}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leerlijn *
                    </label>
                    <select
                      value={formData.learningLineId}
                      onChange={(e) =>
                        setFormData({ ...formData, learningLineId: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecteer leerlijn</option>
                      {learningLines.map((ll) => (
                        <option key={ll.id} value={ll.id}>
                          {ll.title}
                        </option>
                      ))}
                    </select>
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
