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
  const { name, programId } = body

  if (!name || !programId) {
    return NextResponse.json(
      { error: 'Naam en opleiding zijn verplicht' },
      { status: 400 }
    )
  }

  try {
    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        name,
        programId,
      },
      include: {
        program: true,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    return NextResponse.json(
      { error: 'Fout bij bijwerken opleidingsonderdeel' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.course.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Fout bij verwijderen opleidingsonderdeel' },
      { status: 500 }
    )
  }
}
