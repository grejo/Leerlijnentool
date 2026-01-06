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
  const learningLineId = searchParams.get('learningLineId')

  const where = learningLineId ? { learningLineId } : {}

  const components = await prisma.component.findMany({
    where,
    include: {
      learningLine: true,
    },
    orderBy: {
      order: 'asc',
    },
  })

  return NextResponse.json(components)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, learningLineId, order } = body

  if (!name || !learningLineId) {
    return NextResponse.json(
      { error: 'Naam en leerlijn zijn verplicht' },
      { status: 400 }
    )
  }

  const component = await prisma.component.create({
    data: {
      name,
      learningLineId,
      order: order || 0,
    },
    include: {
      learningLine: true,
    },
  })

  return NextResponse.json(component, { status: 201 })
}
