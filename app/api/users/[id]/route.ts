import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { email, password, role, programIds } = body

  const updateData: any = {
    email,
    role,
  }

  if (password) {
    updateData.password = await bcrypt.hash(password, 10)
  }

  // First, delete existing program assignments
  await prisma.userProgram.deleteMany({
    where: { userId: params.id },
  })

  // Then update user and create new program assignments
  const user = await prisma.user.update({
    where: { id: params.id },
    data: {
      ...updateData,
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

  return NextResponse.json(user)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.user.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}
