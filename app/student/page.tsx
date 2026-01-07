import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Program {
  id: string
  name: string
  learningLines: Array<{
    learningLine: {
      id: string
      title: string
    }
  }>
}

export default async function StudentDashboard() {
  const session = await requireAuth()

  const programs: Program[] = await prisma.program.findMany({
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
  }) as Program[]

  return (
    <div className="min-h-screen bg-pxl-white">
      <Navbar userName={session.user.email || ''} userRole={session.user.role} />

      <div className="container-pxl section-pxl">
        <div className="mb-12">
          <h1 className="text-4xl font-heading font-black text-pxl-black accent-gold">
            Welkom bij Leerlijnentool
          </h1>
          <p className="mt-4 text-lg text-gray-600">Selecteer een programma om de leerlijnen te bekijken</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Link
              key={program.id}
              href={`/student/programs/${program.id}`}
              className="card-pxl-hover block"
            >
              <h2 className="text-xl font-heading font-bold text-pxl-black mb-2">
                {program.name}
              </h2>
              <p className="text-sm text-gray-600">
                {program.learningLines.length} leerlijn(en)
              </p>
            </Link>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="card-pxl text-center">
            <p className="text-gray-600">Er zijn nog geen programma's beschikbaar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
