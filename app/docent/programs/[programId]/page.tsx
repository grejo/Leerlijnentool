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
    <div className="min-h-screen bg-pxl-white">
      <Navbar userName={session.user.email || ''} userRole={session.user.role} />

      <div className="container-pxl section-pxl">
        <div className="mb-12">
          <Link
            href="/docent"
            className="link-pxl mb-4 inline-block"
          >
            ← Terug naar dashboard
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-heading font-black text-pxl-black accent-gold">
              {program?.name} - Inhoudsbeheer
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowBulkModal(true)}
                className="btn-pxl-secondary"
              >
                Bulk Import
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="btn-pxl-primary"
              >
                + Nieuwe inhoud
              </button>
            </div>
          </div>
        </div>

        <div className="card-pxl overflow-hidden">
          <table className="table-pxl">
            <thead>
              <tr>
                <th>Leerlijn</th>
                <th>Vakgebied</th>
                <th>Traject</th>
                <th>Vak</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((content) => (
                <tr key={content.id}>
                  <td>{content.learningLine.title}</td>
                  <td>{content.component.name}</td>
                  <td>{content.track.name}</td>
                  <td>{content.course.name}</td>
                  <td>
                    <button
                      onClick={() => handleOpenModal(content)}
                      className="link-pxl mr-4"
                    >
                      Bewerken
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Verwijderen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contents.length === 0 && (
            <div className="p-8 text-center text-gray-600">
              Nog geen inhoud aangemaakt
            </div>
          )}
        </div>

        {/* Content Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-pxl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-pxl-lift">
              <h2 className="text-2xl font-heading font-black text-pxl-black mb-6 accent-gold">
                {editingContent ? 'Inhoud bewerken' : 'Nieuwe inhoud'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-pxl">
                        Leerlijn *
                      </label>
                      <select
                        value={formData.learningLineId}
                        onChange={(e) => handleLearningLineChange(e.target.value)}
                        required
                        className="select-pxl"
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
                      <label className="label-pxl">
                        Vakgebied *
                      </label>
                      <select
                        value={formData.componentId}
                        onChange={(e) =>
                          setFormData({ ...formData, componentId: e.target.value })
                        }
                        required
                        disabled={!formData.learningLineId}
                        className="select-pxl disabled:bg-gray-100 disabled:text-gray-500"
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
                      <label className="label-pxl">
                        Leertraject *
                      </label>
                      <select
                        value={formData.trackId}
                        onChange={(e) =>
                          setFormData({ ...formData, trackId: e.target.value })
                        }
                        required
                        className="select-pxl"
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
                      <label className="label-pxl">
                        Opleidingsonderdeel *
                      </label>
                      <select
                        value={formData.courseId}
                        onChange={(e) =>
                          setFormData({ ...formData, courseId: e.target.value })
                        }
                        required
                        className="select-pxl"
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
                    <label className="label-pxl">
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
                    className="btn-pxl-outline"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-pxl-primary disabled:opacity-50"
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
            <div className="bg-white rounded-pxl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-pxl-lift">
              <h2 className="text-2xl font-heading font-black text-pxl-black mb-6 accent-gold">Bulk Import Inhoud</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Plak JSON-gegevens in het onderstaande veld. Formaat:
                </p>
                <pre className="bg-gray-100 p-3 rounded-pxl text-xs overflow-x-auto border-l-4 border-pxl-gold">
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
                className="input-pxl w-full h-64 font-mono text-sm"
                placeholder="Plak JSON hier..."
              />
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowBulkModal(false)
                    setBulkData('')
                  }}
                  className="btn-pxl-outline"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={loading || !bulkData}
                  className="btn-pxl-primary disabled:opacity-50"
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
