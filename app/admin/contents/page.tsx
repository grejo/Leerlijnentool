'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
})

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

export default function ContentsManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [learningLines, setLearningLines] = useState<LearningLine[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProgramId, setSelectedProgramId] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [formData, setFormData] = useState({
    richTextBody: '',
    programId: '',
    learningLineId: '',
    componentId: '',
    trackId: '',
    courseId: '',
  })

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
      const [progRes, tracksRes] = await Promise.all([
        fetch('/api/programs'),
        fetch('/api/tracks'),
      ])
      const progData = await progRes.json()
      const tracksData = await tracksRes.json()
      setPrograms(progData)
      setTracks(tracksData)
    } catch (error) {
      console.error('Error fetching data:', error)
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

  const fetchLearningLines = async (programId: string) => {
    try {
      const res = await fetch(`/api/learning-lines?programId=${programId}`)
      const data = await res.json()
      setLearningLines(data)
    } catch (error) {
      console.error('Error fetching learning lines:', error)
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

  const fetchCourses = async (programId: string) => {
    try {
      const res = await fetch(`/api/courses?programId=${programId}`)
      const data = await res.json()
      setCourses(data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleOpenModal = (content?: Content) => {
    if (content) {
      setEditingContent(content)
      setFormData({
        richTextBody: content.richTextBody,
        programId: content.program.id,
        learningLineId: content.learningLine.id,
        componentId: content.component.id,
        trackId: content.track.id,
        courseId: content.course.id,
      })
      fetchLearningLines(content.program.id)
      fetchComponents(content.learningLine.id)
      fetchCourses(content.program.id)
    } else {
      setEditingContent(null)
      setFormData({
        richTextBody: '',
        programId: selectedProgramId || '',
        learningLineId: '',
        componentId: '',
        trackId: '',
        courseId: '',
      })
      if (selectedProgramId) {
        fetchLearningLines(selectedProgramId)
        fetchCourses(selectedProgramId)
      }
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingContent(null)
    setFormData({
      richTextBody: '',
      programId: '',
      learningLineId: '',
      componentId: '',
      trackId: '',
      courseId: '',
    })
  }

  const handleProgramChange = (programId: string) => {
    setFormData({ ...formData, programId, learningLineId: '', componentId: '', courseId: '' })
    fetchLearningLines(programId)
    fetchCourses(programId)
    setComponents([])
  }

  const handleLearningLineChange = (learningLineId: string) => {
    setFormData({ ...formData, learningLineId, componentId: '' })
    fetchComponents(learningLineId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingContent) {
        const res = await fetch(`/api/contents/${editingContent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
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
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Fout bij aanmaken inhoud')
          return
        }
      }

      await fetchContents()
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Terug naar dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Leerinhoud Overzicht</h1>
            <p className="text-gray-600 mt-2">Beheer alle leerinhoud per opleiding</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Nieuwe inhoud
          </button>
        </div>

        {/* Program Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecteer Opleiding
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
            <p className="text-gray-500">Geen inhoud gevonden voor deze opleiding</p>
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
                    Vakgebied
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
          </div>
        )}

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
                        Opleiding *
                      </label>
                      <select
                        value={formData.programId}
                        onChange={(e) => handleProgramChange(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Selecteer opleiding</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Leerlijn *
                      </label>
                      <select
                        value={formData.learningLineId}
                        onChange={(e) => handleLearningLineChange(e.target.value)}
                        required
                        disabled={!formData.programId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Selecteer traject</option>
                        {tracks.map((track) => (
                          <option key={track.id} value={track.id}>
                            {track.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opleidingsonderdeel *
                      </label>
                      <select
                        value={formData.courseId}
                        onChange={(e) =>
                          setFormData({ ...formData, courseId: e.target.value })
                        }
                        required
                        disabled={!formData.programId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
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
      </div>
    </div>
  )
}
