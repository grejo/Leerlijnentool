import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const program = await prisma.program.findUnique({
    where: { id: params.id },
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
    return NextResponse.json({ error: 'Program not found' }, { status: 404 })
  }

  return NextResponse.json(program)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name } = body

  const program = await prisma.program.update({
    where: { id: params.id },
    data: { name },
  })

  return NextResponse.json(program)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.program.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}
