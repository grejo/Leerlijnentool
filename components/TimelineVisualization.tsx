'use client'

import { useState } from 'react'

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

interface TimelineVisualizationProps {
  contents: Content[]
  tracks: Track[]
}

interface TooltipState {
  content: Content | null
  position: { x: number; y: number }
}

export default function TimelineVisualization({
  contents,
  tracks,
}: TimelineVisualizationProps) {
  const [tooltip, setTooltip] = useState<TooltipState>({
    content: null,
    position: { x: 0, y: 0 },
  })

  // Group contents by track and component
  const timelineData = tracks.map((track) => {
    const trackContents = contents.filter((c) => c.track.id === track.id)

    // Get unique components for this track
    const componentsMap = new Map<string, { component: Component; contents: Content[] }>()

    trackContents.forEach((content) => {
      const compId = content.component.id
      if (!componentsMap.has(compId)) {
        componentsMap.set(compId, {
          component: content.component,
          contents: [],
        })
      }
      componentsMap.get(compId)!.contents.push(content)
    })

    return {
      track,
      components: Array.from(componentsMap.values()),
    }
  })

  // Filter out tracks with no content
  const filteredTimelineData = timelineData.filter(
    (data) => data.components.length > 0
  )

  const handleMarkerClick = (content: Content, event: React.MouseEvent) => {
    setTooltip({
      content,
      position: { x: 0, y: 0 },
    })
  }

  const closeTooltip = () => {
    setTooltip({ content: null, position: { x: 0, y: 0 } })
  }

  const getComponentColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-indigo-500',
      'bg-red-500',
    ]
    return colors[index % colors.length]
  }

  const getComponentBgColor = (index: number) => {
    const colors = [
      'bg-blue-100',
      'bg-green-100',
      'bg-purple-100',
      'bg-orange-100',
      'bg-pink-100',
      'bg-teal-100',
      'bg-indigo-100',
      'bg-red-100',
    ]
    return colors[index % colors.length]
  }

  const getComponentBorderColor = (index: number) => {
    const colors = [
      'border-blue-500',
      'border-green-500',
      'border-purple-500',
      'border-orange-500',
      'border-pink-500',
      'border-teal-500',
      'border-indigo-500',
      'border-red-500',
    ]
    return colors[index % colors.length]
  }

  if (filteredTimelineData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">
          Geen data beschikbaar voor timeline visualisatie.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-max p-6">
          <div className="space-y-16">
            {filteredTimelineData.map((data, trackIndex) => (
              <div key={data.track.id} className="relative">
                {/* Track Header */}
                <div className="mb-6">
                  <div className="w-64 flex-shrink-0 sticky left-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {data.track.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {data.components.length} vakgebied
                      {data.components.length !== 1 ? 'en' : ''}
                    </p>
                  </div>
                </div>

                {/* Component Bars */}
                <div className="space-y-6 ml-8">
                  {data.components.map((comp, compIndex) => (
                    <div key={comp.component.id} className="flex items-start gap-4">
                      {/* Component Label (Sticky) */}
                      <div className="w-48 flex-shrink-0 sticky left-8 bg-white z-10">
                        <div className="pr-4">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {comp.component.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {comp.contents.length} item
                            {comp.contents.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Timeline Bar */}
                      <div className="flex-1 min-w-[600px]">
                        <div
                          className={`relative h-12 rounded-lg ${getComponentBgColor(
                            compIndex
                          )} border-2 ${getComponentBorderColor(compIndex)} shadow-sm`}
                        >
                          {/* Content Markers */}
                          <div className="absolute inset-0 flex items-center px-4">
                            <div className="flex w-full justify-around">
                              {comp.contents.map((content, contentIndex) => (
                                <button
                                  key={content.id}
                                  onClick={(e) => handleMarkerClick(content, e)}
                                  className="relative group"
                                  title={content.course.name}
                                >
                                  {/* Marker */}
                                  <div
                                    className={`w-6 h-6 rounded-full ${getComponentColor(
                                      compIndex
                                    )} border-2 border-white shadow-md hover:scale-125 transition-all cursor-pointer z-20`}
                                  >
                                    {/* Content number */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">
                                        {contentIndex + 1}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Hover Tooltip */}
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                                      <div className="font-semibold">
                                        {content.course.name}
                                      </div>
                                      <div className="text-gray-300 text-[10px] mt-1">
                                        Klik voor details
                                      </div>
                                      {/* Arrow */}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                        <div className="border-4 border-transparent border-t-gray-900"></div>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Bar Label (component name, visible on bar) */}
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <span
                              className={`text-xs font-medium ${getComponentColor(
                                compIndex
                              )} px-2 py-1 rounded`}
                              style={{ color: 'white' }}
                            >
                              {comp.component.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <span>Leerinhoud (genummerd)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 rounded bg-blue-100 border-2 border-blue-500"></div>
            <span>Vakgebied tijdsbalk</span>
          </div>
          <div className="text-gray-500">
            Hover over een marker voor details • Klik om de volledige inhoud te zien
          </div>
        </div>
      </div>

      {/* Tooltip Modal */}
      {tooltip.content && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeTooltip}
          ></div>

          {/* Tooltip Content */}
          <div
            className="fixed z-50 bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {tooltip.content.component.name}
                </h3>
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tooltip.content.course.name}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tooltip.content.track.name}
                  </span>
                </div>
              </div>
              <button
                onClick={closeTooltip}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none font-light"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-6">
              <div
                className="content-display text-gray-800 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: tooltip.content.richTextBody,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
