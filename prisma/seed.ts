import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@leerlijnentool.nl' },
    update: {},
    create: {
      email: 'admin@leerlijnentool.nl',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create sample programs
  const program1 = await prisma.program.upsert({
    where: { id: 'program-1' },
    update: {},
    create: {
      id: 'program-1',
      name: 'Bachelor Informatica',
    },
  })

  const program2 = await prisma.program.upsert({
    where: { id: 'program-2' },
    update: {},
    create: {
      id: 'program-2',
      name: 'Bachelor Bedrijfsmanagement',
    },
  })
  console.log('Created programs')

  // Create sample learning lines
  const learningLine1 = await prisma.learningLine.upsert({
    where: { id: 'll-1' },
    update: {},
    create: {
      id: 'll-1',
      title: 'Programmeren',
    },
  })

  const learningLine2 = await prisma.learningLine.upsert({
    where: { id: 'll-2' },
    update: {},
    create: {
      id: 'll-2',
      title: 'Databases',
    },
  })
  console.log('Created learning lines')

  // Link learning lines to programs
  await prisma.programLearningLine.upsert({
    where: { id: 'pll-1' },
    update: {},
    create: {
      id: 'pll-1',
      programId: program1.id,
      learningLineId: learningLine1.id,
    },
  })

  await prisma.programLearningLine.upsert({
    where: { id: 'pll-2' },
    update: {},
    create: {
      id: 'pll-2',
      programId: program1.id,
      learningLineId: learningLine2.id,
    },
  })
  console.log('Linked learning lines to programs')

  // Create sample tracks
  const track1 = await prisma.track.upsert({
    where: { id: 'track-1' },
    update: {},
    create: {
      id: 'track-1',
      name: 'Jaar 1',
      order: 1,
    },
  })

  const track2 = await prisma.track.upsert({
    where: { id: 'track-2' },
    update: {},
    create: {
      id: 'track-2',
      name: 'Jaar 2',
      order: 2,
    },
  })
  console.log('Created tracks')

  // Create sample courses
  const course1 = await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      name: 'Inleiding Programmeren',
      programId: program1.id,
    },
  })

  const course2 = await prisma.course.upsert({
    where: { id: 'course-2' },
    update: {},
    create: {
      id: 'course-2',
      name: 'Datamodellering',
      programId: program1.id,
    },
  })
  console.log('Created courses')

  // Create sample components
  const component1 = await prisma.component.upsert({
    where: { id: 'comp-1' },
    update: {},
    create: {
      id: 'comp-1',
      name: 'Basis Syntax',
      learningLineId: learningLine1.id,
      order: 1,
    },
  })

  const component2 = await prisma.component.upsert({
    where: { id: 'comp-2' },
    update: {},
    create: {
      id: 'comp-2',
      name: 'Object Georiënteerd Programmeren',
      learningLineId: learningLine1.id,
      order: 2,
    },
  })
  console.log('Created components')

  // Create sample content
  await prisma.content.upsert({
    where: { id: 'content-1' },
    update: {},
    create: {
      id: 'content-1',
      richTextBody: '<h3>Introductie tot Variabelen</h3><p>In deze les leer je over <strong>variabelen</strong> en datatypes.</p><ul><li>String</li><li>Integer</li><li>Boolean</li></ul>',
      programId: program1.id,
      learningLineId: learningLine1.id,
      componentId: component1.id,
      trackId: track1.id,
      courseId: course1.id,
      createdById: admin.id,
    },
  })
  console.log('Created sample content')

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
