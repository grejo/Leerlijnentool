import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const programId = searchParams.get('programId')

  let learningLines

  if (programId) {
    // Get learning lines for a specific program
    learningLines = await prisma.learningLine.findMany({
      where: {
        programs: {
          some: {
            programId: programId,
          },
        },
      },
      include: {
        components: {
          orderBy: {
            order: 'asc',
          },
        },
        programs: {
          include: {
            program: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    })
  } else {
    // Get all learning lines
    learningLines = await prisma.learningLine.findMany({
      include: {
        components: {
          orderBy: {
            order: 'asc',
          },
        },
        programs: {
          include: {
            program: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    })
  }

  return NextResponse.json(learningLines)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, programIds } = body

  if (!title) {
    return NextResponse.json({ error: 'Titel is verplicht' }, { status: 400 })
  }

  const learningLine = await prisma.learningLine.create({
    data: {
      title,
      programs: programIds
        ? {
            create: programIds.map((programId: string) => ({
              programId,
            })),
          }
        : undefined,
    },
    include: {
      programs: {
        include: {
          program: true,
        },
      },
    },
  })

  return NextResponse.json(learningLine, { status: 201 })
}
