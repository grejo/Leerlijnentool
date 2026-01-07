import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { notFound } from 'next/navigation'

interface ProgramLearningLine {
  learningLine: {
    id: string
    title: string
    components: Array<{
      id: string
      name: string
      order: number
    }>
  }
}

interface ProgramWithLearningLines {
  id: string
  name: string
  learningLines: ProgramLearningLine[]
}

export default async function ProgramLearningLines({
  params,
}: {
  params: { programId: string }
}) {
  const session = await requireAuth()

  const program: ProgramWithLearningLines | null = await prisma.program.findUnique({
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
  }) as ProgramWithLearningLines | null

  if (!program) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-pxl-white">
      <Navbar userName={session.user.email || ''} userRole={session.user.role} />

      <div className="container-pxl section-pxl">
        <div className="mb-12">
          <Link
            href="/student"
            className="link-pxl mb-4 inline-block"
          >
            ← Terug naar programma's
          </Link>
          <h1 className="text-4xl font-heading font-black text-pxl-black accent-gold">{program.name}</h1>
          <p className="mt-4 text-lg text-gray-600">Selecteer een leerlijn om de inhoud te bekijken</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {program.learningLines.map((pl) => (
            <Link
              key={pl.learningLine.id}
              href={`/student/programs/${params.programId}/learning-lines/${pl.learningLine.id}`}
              className="card-pxl-hover block"
            >
              <h2 className="text-xl font-heading font-bold text-pxl-black mb-2">
                {pl.learningLine.title}
              </h2>
              <p className="text-sm text-gray-600">
                {(pl.learningLine.components && pl.learningLine.components.length) || 0} vakgebied(en)
              </p>
            </Link>
          ))}
        </div>

        {program.learningLines.length === 0 && (
          <div className="card-pxl text-center">
            <p className="text-gray-600">
              Er zijn nog geen leerlijnen gekoppeld aan dit programma.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
