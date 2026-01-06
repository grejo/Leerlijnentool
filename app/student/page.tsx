import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default async function StudentDashboard() {
  const session = await requireAuth()

  const programs = await prisma.program.findMany({
    include: {
      learningLines: {
        include: {
          learningLine: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={session.user.email || ''} userRole={session.user.role} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welkom bij Leerlijnentool</h1>
          <p className="mt-2 text-gray-600">Selecteer een programma om de leerlijnen te bekijken</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Link
              key={program.id}
              href={`/student/programs/${program.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {program.name}
              </h2>
              <p className="text-sm text-gray-500">
                {program.learningLines.length} leerlijn(en)
              </p>
            </Link>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Er zijn nog geen programma's beschikbaar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
