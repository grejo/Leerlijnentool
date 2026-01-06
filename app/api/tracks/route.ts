import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tracks = await prisma.track.findMany({
    orderBy: {
      order: 'asc',
    },
    include: {
      programs: {
        include: {
          program: true,
        },
      },
    },
  })

  return NextResponse.json(tracks)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, order, programIds } = body

  if (!name) {
    return NextResponse.json({ error: 'Naam is verplicht' }, { status: 400 })
  }

  const track = await prisma.track.create({
    data: {
      name,
      order: order || 0,
      programs: programIds && programIds.length > 0 ? {
        create: programIds.map((programId: string) => ({ programId }))
      } : undefined,
    },
    include: {
      programs: {
        include: {
          program: true,
        },
      },
    },
  })

  return NextResponse.json(track, { status: 201 })
}
