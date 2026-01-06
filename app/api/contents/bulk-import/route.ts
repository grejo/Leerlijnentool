import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !['ADMIN', 'DOCENT'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { contents } = body

  if (!Array.isArray(contents) || contents.length === 0) {
    return NextResponse.json(
      { error: 'Contents moet een niet-lege array zijn' },
      { status: 400 }
    )
  }

  // Validate and check permissions for all contents
  for (const content of contents) {
    const {
      richTextBody,
      programId,
      learningLineId,
      componentId,
      trackId,
      courseId,
    } = content

    if (
      !richTextBody ||
      !programId ||
      !learningLineId ||
      !componentId ||
      !trackId ||
      !courseId
    ) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht voor elke content entry' },
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
          { error: `U bent niet toegewezen aan programma ${programId}` },
          { status: 403 }
        )
      }
    }
  }

  // Create all contents
  const createdContents = await prisma.$transaction(
    contents.map((content) =>
      prisma.content.create({
        data: {
          richTextBody: content.richTextBody,
          programId: content.programId,
          learningLineId: content.learningLineId,
          componentId: content.componentId,
          trackId: content.trackId,
          courseId: content.courseId,
          createdById: session.user.id,
        },
        include: {
          program: true,
          learningLine: true,
          component: true,
          track: true,
          course: true,
        },
      })
    )
  )

  return NextResponse.json(
    {
      success: true,
      count: createdContents.length,
      contents: createdContents,
    },
    { status: 201 }
  )
}
