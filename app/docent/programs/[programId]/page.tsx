'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
})

interface Program {
  id: string
  name: string
}

interface LearningLine {
  id: string
  title: string
}

interface Component {
  id: string
  name: string
}

interface Track {
  id: string
  name: string
}

interface Course {
  id: string
  name: string
}

interface Content {
  id: string
  richTextBody: string
  component: Component
  course: Course
  track: Track
  learningLine: LearningLine
}

export default function DocentProgramManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const programId = params.programId as string

  const [program, setProgram] = useState<Program | null>(null)
  const [learningLines, setLearningLines] = useState<LearningLine[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [formData, setFormData] = useState({
    richTextBody: '',
    learningLineId: '',
    componentId: '',
    trackId: '',
    courseId: '',
  })

  const [bulkData, setBulkData] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || !['ADMIN', 'DOCENT'].includes(session.user.role)) {
      router.push('/')
      return
    }
    fetchData()
  }, [session, status, router, programId])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch program
      const programRes = await fetch(`/api/programs`)
      const programsData = await programRes.json()
      const foundProgram = programsData.find((p: Program) => p.id === programId)
      setProgram(foundProgram)

      // Fetch learning lines
      const llRes = await fetch(`/api/learning-lines?programId=${programId}`)
      const llData = await llRes.json()
      setLearningLines(llData)

      // Fetch tracks
      const tracksRes = await fetch('/api/tracks')
      const tracksData = await tracksRes.json()
      setTracks(tracksData)

      // Fetch courses
      const coursesRes = await fetch(`/api/courses?programId=${programId}`)
      const coursesData = await coursesRes.json()
      setCourses(coursesData)

      // Fetch contents
      const contentsRes = await fetch(`/api/contents?programId=${programId}`)
      const contentsData = await contentsRes.json()
      setContents(contentsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComponents = async (learningLineId: string) => {
    try {
      const res = await fetch(`/api/components?learningLineId=${learningLineId}`)
      const data = await res.json()
      setComponents(data)
    } catch (error) {
      console.error('Error fetching components:', error)
    }
  }

  const handleOpenModal = (content?: Content) => {
    if (content) {
      setEditingContent(content)
      setFormData({
        richTextBody: content.richTextBody,
        learningLineId: content.learningLine.id,
        componentId: content.component.id,
        trackId: content.track.id,
        courseId: content.course.id,
      })
      fetchComponents(content.learningLine.id)
    } else {
      setEditingContent(null)
      setFormData({
        richTextBody: '',
        learningLineId: '',
        componentId: '',
        trackId: '',
        courseId: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingContent(null)
  }

  const handleLearningLineChange = (learningLineId: string) => {
    setFormData({ ...formData, learningLineId, componentId: '' })
    fetchComponents(learningLineId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        programId,
      }

      if (editingContent) {
        const res = await fetch(`/api/contents/${editingContent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij bijwerken inhoud')
          return
        }
      } else {
        const res = await fetch('/api/contents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij aanmaken inhoud')
          return
        }
      }

      await fetchData()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Er is een fout opgetreden')
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

      await fetchData()
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkImport = async () => {
    try {
      const parsedData = JSON.parse(bulkData)

      if (!Array.isArray(parsedData)) {
        alert('Data moet een array zijn')
        return
      }

      setLoading(true)

      const res = await fetch('/api/contents/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: parsedData }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Fout bij bulk import')
        return
      }

      const result = await res.json()
      alert(`${result.count} inhoud items succesvol geïmporteerd`)

      await fetchData()
      setShowBulkModal(false)
      setBulkData('')
    } catch (error) {
      console.error('Error bulk importing:', error)
      alert('Fout bij het parsen van JSON. Controleer uw invoer.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
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
            href="/docent"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Terug naar dashboard
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {program?.name} - Inhoudsbeheer
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowBulkModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Bulk Import
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                + Nieuwe inhoud
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Leerlijn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vakgebied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Traject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleOpenModal(content)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Bewerken
                    </button>
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
          {contents.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nog geen inhoud aangemaakt
            </div>
          )}
        </div>

        {/* Content Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingContent ? 'Inhoud bewerken' : 'Nieuwe inhoud'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Leerlijn *
                      </label>
                      <select
                        value={formData.learningLineId}
                        onChange={(e) => handleLearningLineChange(e.target.value)}
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
                        Vakgebied *
                      </label>
                      <select
                        value={formData.componentId}
                        onChange={(e) =>
                          setFormData({ ...formData, componentId: e.target.value })
                        }
                        required
                        disabled={!formData.learningLineId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecteer vakgebied</option>
                        {components.map((comp) => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Leertraject *
                      </label>
                      <select
                        value={formData.trackId}
                        onChange={(e) =>
                          setFormData({ ...formData, trackId: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecteer traject</option>
                        {tracks.map((track) => (
                          <option key={track.id} value={track.id}>
                            {track.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opleidingsonderdeel *
                      </label>
                      <select
                        value={formData.courseId}
                        onChange={(e) =>
                          setFormData({ ...formData, courseId: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecteer vak</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inhoud *
                    </label>
                    <RichTextEditor
                      content={formData.richTextBody}
                      onChange={(html) =>
                        setFormData({ ...formData, richTextBody: html })
                      }
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

        {/* Bulk Import Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Bulk Import Inhoud</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Plak JSON-gegevens in het onderstaande veld. Formaat:
                </p>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`[
  {
    "richTextBody": "<p>Inhoud hier</p>",
    "programId": "program-id",
    "learningLineId": "ll-id",
    "componentId": "comp-id",
    "trackId": "track-id",
    "courseId": "course-id"
  }
]`}
                </pre>
              </div>
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                placeholder="Plak JSON hier..."
              />
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowBulkModal(false)
                    setBulkData('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={loading || !bulkData}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  {loading ? 'Importeren...' : 'Importeren'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
