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

  const where = programId ? { programId } : {}

  const courses = await prisma.course.findMany({
    where,
    include: {
      program: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return NextResponse.json(courses)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !['ADMIN', 'DOCENT'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, programId } = body

  if (!name || !programId) {
    return NextResponse.json(
      { error: 'Naam en programma zijn verplicht' },
      { status: 400 }
    )
  }

  const course = await prisma.course.create({
    data: {
      name,
      programId,
    },
    include: {
      program: true,
    },
  })

  return NextResponse.json(course, { status: 201 })
}
