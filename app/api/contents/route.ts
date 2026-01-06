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
  const learningLineId = searchParams.get('learningLineId')
  const trackId = searchParams.get('trackId')
  const courseId = searchParams.get('courseId')

  const where: any = {}

  if (programId) where.programId = programId
  if (learningLineId) where.learningLineId = learningLineId
  if (trackId) where.trackId = trackId
  if (courseId) where.courseId = courseId

  const contents = await prisma.content.findMany({
    where,
    include: {
      program: true,
      learningLine: true,
      component: true,
      track: true,
      course: true,
      createdBy: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(contents)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !['ADMIN', 'DOCENT'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    richTextBody,
    programId,
    learningLineId,
    componentId,
    trackId,
    courseId,
  } = body

  if (
    !richTextBody ||
    !programId ||
    !learningLineId ||
    !componentId ||
    !trackId ||
    !courseId
  ) {
    return NextResponse.json(
      { error: 'Alle velden zijn verplicht' },
      { status: 400 }
    )
  }

  // Check if docent is assigned to this program
  if (session.user.role === 'DOCENT') {
    const userProgram = await prisma.userProgram.findFirst({
      where: {
        userId: session.user.id,
        programId: programId,
      },
    })

    if (!userProgram) {
      return NextResponse.json(
        { error: 'U bent niet toegewezen aan dit programma' },
        { status: 403 }
      )
    }
  }

  const content = await prisma.content.create({
    data: {
      richTextBody,
      programId,
      learningLineId,
      componentId,
      trackId,
      courseId,
      createdById: session.user.id,
    },
    include: {
      program: true,
      learningLine: true,
      component: true,
      track: true,
      course: true,
      createdBy: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  })

  return NextResponse.json(content, { status: 201 })
}
