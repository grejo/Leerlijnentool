import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { notFound } from 'next/navigation'

export default async function ProgramLearningLines({
  params,
}: {
  params: { programId: string }
}) {
  const session = await requireAuth()

  const program = await prisma.program.findUnique({
    where: { id: params.programId },
    include: {
      learningLines: {
        include: {
          learningLine: {
            include: {
              components: {
                orderBy: {
                  order: 'asc',
                },
              },
            },
          },
        },
      },
    },
  })

  if (!program) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={session.user.email || ''} userRole={session.user.role} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/student"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Terug naar programma's
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{program.name}</h1>
          <p className="mt-2 text-gray-600">Selecteer een leerlijn om de inhoud te bekijken</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {program.learningLines.map((pl) => (
            <Link
              key={pl.learningLine.id}
              href={`/student/programs/${params.programId}/learning-lines/${pl.learningLine.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {pl.learningLine.title}
              </h2>
              <p className="text-sm text-gray-500">
                {(pl.learningLine.components && pl.learningLine.components.length) || 0} vakgebied(en)
              </p>
            </Link>
          ))}
        </div>

        {program.learningLines.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">
              Er zijn nog geen leerlijnen gekoppeld aan dit programma.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
