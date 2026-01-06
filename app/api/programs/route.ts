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
  const userId = searchParams.get('userId')

  let programs

  if (userId && session.user.role === 'DOCENT') {
    // Get only programs assigned to this docent
    programs = await prisma.program.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        courses: true,
        learningLines: {
          include: {
            learningLine: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
  } else {
    // Get all programs
    programs = await prisma.program.findMany({
      include: {
        courses: true,
        learningLines: {
          include: {
            learningLine: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  return NextResponse.json(programs)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name } = body

  if (!name) {
    return NextResponse.json({ error: 'Naam is verplicht' }, { status: 400 })
  }

  const program = await prisma.program.create({
    data: { name },
  })

  return NextResponse.json(program, { status: 201 })
}
