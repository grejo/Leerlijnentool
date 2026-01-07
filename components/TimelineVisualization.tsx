'use client'

import { useState } from 'react'

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
}

interface TimelineVisualizationProps {
  contents: Content[]
  tracks: Track[]
}

export default function TimelineVisualization({ contents, tracks }: TimelineVisualizationProps) {
  const [hoveredContent, setHoveredContent] = useState<string | null>(null)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)

  // Group contents by track and component
  const timelineData = tracks.map(track => {
    const trackContents = contents.filter(c => c.track.id === track.id)

    // Get unique components for this track
    const components = Array.from(
      new Set(trackContents.map(c => c.component.id))
    ).map(componentId => {
      const component = trackContents.find(c => c.component.id === componentId)?.component
      const componentContents = trackContents.filter(c => c.component.id === componentId)
      return {
        component: component!,
        contents: componentContents
      }
    })

    return {
      track,
      components
    }
  })

  return (
    <>
      <div className="card-pxl">
        <div className="mb-6">
          <h2 className="text-2xl font-heading font-black text-pxl-black accent-gold">
            Leertraject Visualisatie
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Horizontaal scrollen om alle vakgebieden te bekijken. Klik op een node voor details.
          </p>
        </div>

        {/* Timeline Container with Horizontal Scroll */}
        <div className="overflow-x-auto -mx-6 -mb-6">
          <div className="min-w-max px-6 pb-6">
          {/* Timeline Grid */}
          <div className="space-y-4">
            {timelineData.map(({ track, components }) => (
              <div key={track.id} className="flex items-stretch min-h-[120px]">
                {/* Sticky Track Label */}
                <div className="sticky left-0 z-10 bg-pxl-white pr-4 flex items-center min-w-[180px] border-r-2 border-pxl-gold">
                  <div>
                    <h3 className="font-heading font-bold text-pxl-black text-sm">
                      {track.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {components.reduce((sum, comp) => sum + comp.contents.length, 0)} inhoud(en)
                    </p>
                  </div>
                </div>

                {/* Timeline Track */}
                <div className="flex-1 relative ml-4">
                  {/* Horizontal Timeline Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />

                  {/* Component Segments and Nodes */}
                  <div className="flex gap-8 relative">
                    {components.map((comp, compIndex) => (
                      <div key={comp.component.id} className="relative flex flex-col items-center justify-center">
                        {/* Segment Label */}
                        <div className="absolute -top-8 text-center">
                          <div className="bg-gray-100 text-pxl-black px-3 py-1 rounded font-medium text-xs whitespace-nowrap border border-gray-300">
                            {comp.component.name}
                          </div>
                        </div>

                        {/* Content Nodes */}
                        <div className="flex gap-3 items-center">
                          {comp.contents.map((content, contentIndex) => (
                            <div
                              key={content.id}
                              className="relative group"
                            >
                              {/* Node Marker */}
                              <button
                                onClick={() => setSelectedContent(content)}
                                onMouseEnter={() => setHoveredContent(content.id)}
                                onMouseLeave={() => setHoveredContent(null)}
                                className="w-5 h-5 bg-pxl-gold rounded-full border-2 border-pxl-black cursor-pointer hover:scale-125 hover:shadow-lg transition-all duration-200 relative z-10"
                                aria-label={`Bekijk ${content.course.name}`}
                              />

                              {/* Hover Tooltip - Simplified */}
                              {hoveredContent === content.id && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-pxl-black text-pxl-white px-3 py-2 rounded-lg shadow-xl z-50 pointer-events-none whitespace-normal">
                                  <div className="text-xs font-bold text-pxl-gold">
                                    {content.course.name}
                                  </div>
                                  <div className="text-xs mt-1 text-gray-300">
                                    Klik voor details
                                  </div>
                                  {/* Tooltip Arrow */}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-pxl-black" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Segment Connector Line */}
                        {compIndex < components.length - 1 && (
                          <div className="absolute top-1/2 left-full w-8 h-1 bg-gray-300 -translate-y-1/2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {timelineData.every(td => td.components.length === 0) && (
            <div className="text-center py-12 text-gray-600">
              <p>Geen inhoud beschikbaar voor de geselecteerde filters.</p>
            </div>
          )}
        </div>
      </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-pxl-gold rounded-full border-2 border-pxl-black" />
              <span className="text-gray-600">Leerinhoud (klik voor details)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1 bg-gray-200" />
              <span className="text-gray-600">Leertraject</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Detail Modal */}
      {selectedContent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedContent(null)}
        >
          <div
            className="bg-white rounded-pxl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-pxl-lift"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-heading font-black text-pxl-black accent-gold mb-2">
                  {selectedContent.course.name}
                </h3>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {selectedContent.component.name}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {selectedContent.track.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedContent(null)}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Sluiten"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="prose prose-sm max-w-none">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedContent.richTextBody }}
              />
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedContent(null)}
                className="btn-pxl-secondary"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
