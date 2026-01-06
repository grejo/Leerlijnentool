'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Track {
  id: string
  name: string
}

interface Course {
  id: string
  name: string
}

interface Component {
  id: string
  name: string
}

interface Content {
  id: string
  richTextBody: string
  component: Component
  course: Course
  track: Track
}

export default function ContentView() {
  const { data: session } = useSession()
  const params = useParams()
  const programId = params.programId as string
  const learningLineId = params.learningLineId as string

  const [tracks, setTracks] = useState<Track[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [contents, setContents] = useState<Content[]>([])
  const [selectedTrackId, setSelectedTrackId] = useState<string>('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchData()
  }, [programId, learningLineId, selectedTrackId, selectedCourseId])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch tracks
      const tracksRes = await fetch('/api/tracks')
      const tracksData = await tracksRes.json()
      setTracks(tracksData)

      // Fetch courses for this program
      const coursesRes = await fetch(`/api/courses?programId=${programId}`)
      const coursesData = await coursesRes.json()
      setCourses(coursesData)

      // Fetch contents
      let url = `/api/contents?programId=${programId}&learningLineId=${learningLineId}`
      if (selectedTrackId) url += `&trackId=${selectedTrackId}`
      if (selectedCourseId) url += `&courseId=${selectedCourseId}`

      const contentsRes = await fetch(url)
      const contentsData = await contentsRes.json()
      setContents(contentsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleComponent = (componentId: string) => {
    const newExpanded = new Set(expandedComponents)
    if (newExpanded.has(componentId)) {
      newExpanded.delete(componentId)
    } else {
      newExpanded.add(componentId)
    }
    setExpandedComponents(newExpanded)
  }

  const groupedContents = contents.reduce((acc, content) => {
    const componentId = content.component.id
    if (!acc[componentId]) {
      acc[componentId] = {
        component: content.component,
        contents: [],
      }
    }
    acc[componentId].contents.push(content)
    return acc
  }, {} as Record<string, { component: Component; contents: Content[] }>)

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={session.user.email || ''} userRole={session.user.role} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href={`/student/programs/${programId}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Terug naar leerlijnen
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Leerinhoud</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leertraject
              </label>
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Alle trajecten</option>
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opleidingsonderdeel
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Alle onderdelen</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content grouped by Component */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Laden...</p>
          </div>
        ) : Object.keys(groupedContents).length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Geen inhoud gevonden met de geselecteerde filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(groupedContents).map(({ component, contents }) => (
              <div key={component.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleComponent(component.id)}
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {component.name}
                  </h3>
                  <span className="text-gray-500">
                    {expandedComponents.has(component.id) ? '▼' : '▶'}
                  </span>
                </button>

                {expandedComponents.has(component.id) && (
                  <div className="p-6 space-y-4">
                    {contents.map((content) => (
                      <div
                        key={content.id}
                        className="border-l-4 border-blue-500 pl-4 py-2"
                      >
                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {content.course.name}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {content.track.name}
                          </span>
                        </div>
                        <div
                          className="content-display text-gray-800"
                          dangerouslySetInnerHTML={{ __html: content.richTextBody }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
