import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      programs: {
        include: {
          program: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { email, password, role, programIds } = body

  if (!email || !password || !role) {
    return NextResponse.json(
      { error: 'Email, wachtwoord en rol zijn verplicht' },
      { status: 400 }
    )
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return NextResponse.json(
      { error: 'Gebruiker met dit e-mailadres bestaat al' },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
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

  return NextResponse.json(user, { status: 201 })
}
