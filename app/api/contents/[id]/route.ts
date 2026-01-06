import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const content = await prisma.content.update({
    where: { id: params.id },
    data: {
      richTextBody,
      programId,
      learningLineId,
      componentId,
      trackId,
      courseId,
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

  return NextResponse.json(content)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !['ADMIN', 'DOCENT'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if docent is assigned to this program
  if (session.user.role === 'DOCENT') {
    const content = await prisma.content.findUnique({
      where: { id: params.id },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content niet gevonden' },
        { status: 404 }
      )
    }

    const userProgram = await prisma.userProgram.findFirst({
      where: {
        userId: session.user.id,
        programId: content.programId,
      },
    })

    if (!userProgram) {
      return NextResponse.json(
        { error: 'U bent niet toegewezen aan dit programma' },
        { status: 403 }
      )
    }
  }

  await prisma.content.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}
