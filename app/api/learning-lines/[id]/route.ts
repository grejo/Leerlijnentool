import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, programIds } = body

  // Delete existing program links
  await prisma.programLearningLine.deleteMany({
    where: { learningLineId: params.id },
  })

  const learningLine = await prisma.learningLine.update({
    where: { id: params.id },
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

  return NextResponse.json(learningLine)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.learningLine.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}
