'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TimelineVisualization from '@/components/TimelineVisualization'

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
  const [showTimeline, setShowTimeline] = useState(false)

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
    <div className="min-h-screen bg-pxl-white">
      <Navbar userName={session.user.email || ''} userRole={session.user.role} />

      <div className="container-pxl section-pxl">
        <div className="mb-12">
          <Link
            href={`/student/programs/${programId}`}
            className="link-pxl mb-4 inline-block"
          >
            ← Terug naar leerlijnen
          </Link>
          <h1 className="text-4xl font-heading font-black text-pxl-black accent-gold">Leerinhoud</h1>
        </div>

        {/* Toggle View and Filters */}
        <div className="card-pxl mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-pxl-black">Filters</h2>

            {/* Toggle Button */}
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                showTimeline
                  ? 'bg-pxl-gold text-pxl-black shadow-pxl-hover'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-sm font-heading">
                {showTimeline ? 'Toon Standaardweergave' : 'Toon Leertraject Visualisatie'}
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${showTimeline ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-pxl">
                Leertraject
              </label>
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="select-pxl"
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
              <label className="label-pxl">
                Opleidingsonderdeel
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="select-pxl"
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

        {/* Content Display - Timeline or Standard View */}
        {loading ? (
          <div className="card-pxl text-center">
            <p className="text-gray-600">Laden...</p>
          </div>
        ) : showTimeline ? (
          <TimelineVisualization contents={contents} tracks={tracks} />
        ) : Object.keys(groupedContents).length === 0 ? (
          <div className="card-pxl text-center">
            <p className="text-gray-600">Geen inhoud gevonden met de geselecteerde filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(groupedContents).map(({ component, contents }) => (
              <div key={component.id} className="card-pxl overflow-hidden">
                <button
                  onClick={() => toggleComponent(component.id)}
                  className="w-full px-6 py-4 -mx-6 -mt-6 mb-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center border-b-2 border-pxl-gold"
                >
                  <h3 className="text-lg font-heading font-bold text-pxl-black">
                    {component.name}
                  </h3>
                  <span className="text-pxl-gold text-xl font-bold">
                    {expandedComponents.has(component.id) ? '▼' : '▶'}
                  </span>
                </button>

                {expandedComponents.has(component.id) && (
                  <div className="space-y-4">
                    {contents.map((content) => (
                      <div
                        key={content.id}
                        className="border-l-4 border-pxl-gold pl-4 py-2"
                      >
                        <div className="flex items-center gap-2 mb-2 text-sm">
                          <span className="bg-gray-100 text-pxl-black px-2 py-1 rounded font-medium">
                            {content.course.name}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {content.track.name}
                          </span>
                        </div>
                        <div
                          className="content-display text-pxl-black"
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
